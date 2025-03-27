import { LoginParams, RegisterParams, User } from '@/types/auth';
import { ApiError } from '@/lib/error';
import { bcrypt } from '@/lib/crypto';
import { sign, verify } from 'jsonwebtoken';
import { client } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { JwtPayload } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DbUser {
  id: string;
  username: string;
  password: string;
  nickname: string;
}

interface WechatLoginParams {
  openId: string;
  nickname: string;
  avatar: string;
}

export class AuthService {
  private async findUserByUsername(username: string): Promise<DbUser | null> {
    const users = await client.query<DbUser>(
      `
      select User {
        id,
        username,
        password,
        nickname
      }
      filter .username = <str>$username
      limit 1
      `,
      { username }
    );

    return users[0] || null;
  }

  private formatUserResponse(user: DbUser): User {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
    };
  }

  async login(params: LoginParams) {
    const { username, password } = params;
    const user = await this.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError('用户名或密码错误', 401);
    }

    return {
      token: generateToken({
        id: user.id,
        username: user.username,
      }),
      user: this.formatUserResponse(user),
    };
  }

  async register(params: RegisterParams) {
    const { username, password, nickname } = params;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new ApiError('用户名已存在', 400);
    }

    const hashedPassword = await bcrypt.hash(password);
    const users = await client.query<DbUser>(
      `
      insert User {
        username := <str>$username,
        password := <str>$hashedPassword,
        nickname := <str>$nickname
      }
      `,
      { username, hashedPassword, nickname }
    );

    const newUser = users[0];
    if (!newUser) {
      throw new ApiError('用户创建失败', 500);
    }

    return {
      token: generateToken({
        id: newUser.id,
        username: newUser.username,
      }),
      user: this.formatUserResponse(newUser),
    };
  }

  private async generateToken(userId: string): Promise<string> {
    return sign(
      {
        userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      JWT_SECRET
    );
  }

  async getCurrentUser(token: string) {
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    const users = await client.query<DbUser>(
      `
      select User {
        id,
        username,
        nickname,
        created_at
      }
      filter .id = <uuid>$userId
      limit 1
      `,
      { userId: decoded.userId }
    );

    if (!users.length) {
      throw new ApiError('用户不存在', 404);
    }

    return this.formatUserResponse(users[0]);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new ApiError('无效的 token', 401);
    }
  }

  // 新增方法：根据 token 获取用户信息
  async getUserByToken(token: string): Promise<User> {
    try {
      const decoded = verify(token, JWT_SECRET) as JwtPayload;
      const users = await client.query<DbUser>(
        `
        select User {
          id,
          username,
          nickname
        }
        filter .id = <uuid>$userId
        limit 1
        `,
        { userId: decoded.userId }
      );

      if (!users.length) {
        throw new ApiError('用户不存在', 404);
      }

      return this.formatUserResponse(users[0]);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('无效的 token', 401);
    }
  }

  async handleWechatLogin(params: WechatLoginParams) {
    const { openId, nickname, avatar } = params;

    try {
      // 查找是否存在微信绑定的用户
      const existingUsers = await client.query(
        `
          select default::User {
            id,
            username,
            nickname,
            wechat_open_id
          }
          filter .wechat_open_id = <str>$openId
          limit 1
          `,
        { openId }
      );

      let user: User[];

      if (existingUsers.length > 0) {
        // 已存在用户，更新信息
        user = await client.query(
          `
            update default::User
            filter .wechat_open_id = <str>$openId
            set {
              nickname := <str>$nickname,
              avatar := <str>$avatar,
              updated_at := datetime_current()
            }
            `,
          { openId, nickname, avatar }
        );
      } else {
        // 创建新用户
        const username = `wx_${openId.slice(-8)}`;
        user = await client.query(
          `
            insert default::User {
              username := <str>$username,
              nickname := <str>$nickname,
              avatar := <str>$avatar,
              wechat_open_id := <str>$openId,
              password := <str>$password,
              created_at := datetime_current(),
              updated_at := datetime_current()
            }
            `,
          {
            username,
            nickname,
            avatar,
            openId,
            password: Math.random().toString(36).slice(-8), // 生成随机密码
          }
        );
      }

      if (!user.length) {
        throw new ApiError('用户创建失败', 500);
      }

      // 生成 token
      const token = generateToken({
        id: user[0].id,
        username: user[0].username,
      });

      return {
        token,
        user: {
          id: user[0].id,
          username: user[0].username,
          nickname: user[0].nickname,
        },
      };
    } catch (error) {
      console.error('微信登录处理错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('微信登录失败', 500);
    }
  }
}

export const authService = new AuthService();
