import { LoginParams, RegisterParams, User } from '@/types/auth';
import { ApiError } from '@/lib/error';
import { bcrypt } from '@/lib/crypto';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { JwtPayload } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DbUser {
  id: string;
  username: string;
  password?: string;
  nickname: string;
}

interface WechatLoginParams {
  openId: string;
  nickname: string;
  avatar: string;
}

export class AuthService {
  private async findUserByUsername(username: string): Promise<DbUser | null> {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        nickname: true,
      },
    });
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

    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
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
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname,
      },
      select: {
        id: true,
        username: true,
        password: true,
        nickname: true,
      },
    });

    return {
      token: generateToken({
        id: newUser.id,
        username: newUser.username,
      }),
      user: this.formatUserResponse(newUser),
    };
  }

  async getCurrentUser(token: string) {
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError('用户不存在', 404);
    }

    return this.formatUserResponse(user);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new ApiError('无效的 token', 401);
    }
  }

  async getUserByToken(token: string): Promise<User> {
    try {
      const decoded = verify(token, JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          nickname: true,
        },
      });

      if (!user) {
        throw new ApiError('用户不存在', 404);
      }

      return this.formatUserResponse(user);
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
      const existingUser = await prisma.user.findUnique({
        where: { wechatOpenId: openId },
        select: {
          id: true,
          username: true,
          nickname: true,
        },
      });

      let user: { id: string; username: string; nickname: string };

      if (existingUser) {
        user = await prisma.user.update({
          where: { wechatOpenId: openId },
          data: { nickname, avatar },
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        });
      } else {
        const username = `wx_${openId.slice(-8)}`;
        user = await prisma.user.create({
          data: {
            username,
            nickname,
            avatar,
            wechatOpenId: openId,
            password: Math.random().toString(36).slice(-8),
          },
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        });
      }

      const token = generateToken({
        id: user.id,
        username: user.username,
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
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
