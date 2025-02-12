import { LoginParams, RegisterParams, User } from '@/types/auth';
import { ApiError } from '@/lib/error';
import { bcrypt } from '@/lib/crypto';
import { sign } from 'jsonwebtoken';
import { client } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DbUser {
  id: string;
  username: string;
  password: string;
  nickname: string;
}

import { verify } from 'jsonwebtoken';

import { JwtPayload } from '@/lib/auth';

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

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new ApiError('用户名或密码错误', 401);
    }

    return {
      token: await this.generateToken(user.id),
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
      token: await this.generateToken(newUser.id),
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
}

export const authService = new AuthService();
