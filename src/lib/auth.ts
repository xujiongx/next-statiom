import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiError } from './error';
import { cookies, headers } from 'next/headers';
import { authService } from '@/server/services/auth.service';
import { JWT_SECRET } from '@/config'


export interface JwtPayload {
  userId: string;
  username: string;
  exp: number;
}

export interface Session {
  user: {
    id: string;
    username: string;
    nickname?: string;
  } | null;
  expires: string;
}

export const getUserId = async (request: Request) => {
  let token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) {
    throw new ApiError('未登录', 401);
  }

  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload;


    if (!decoded.userId) {
      throw new ApiError('无效的 token', 401);
    }
    return decoded.userId;
  } catch {
    throw new ApiError('无效的 token', 401);
  }
};

export const verifyAuth = (request: NextRequest) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError('未登录', 401);
  }

  try {
    return verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new ApiError('无效的 token', 401);
  }
};

/**
 * 从服务器端获取当前用户会话信息
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    // 尝试从请求头获取 token
    const headersList = await headers();
    let token = headersList.get('Authorization')?.replace('Bearer ', '');

    // 如果请求头中没有，尝试从 cookie 获取
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }

    if (!token) {
      return null;
    }

    // 验证 token 并获取用户信息
    const user = await authService.getUserByToken(token);

    return {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch (error) {
    console.error('获取会话信息失败:', error);
    return null;
  }
}
