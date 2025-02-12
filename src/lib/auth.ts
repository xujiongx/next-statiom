import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { ApiError } from './error';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  userId: string;
  exp: number;
}

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