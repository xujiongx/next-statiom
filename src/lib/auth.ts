import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiError } from './error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  userId: string;
  exp: number;
}

export const getUserId = async (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

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
