import { JWT_SECRET } from '@/config';
import { sign } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  return sign(
    {
      userId: payload.id,
      username: payload.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7天过期
    },
    JWT_SECRET
  );
}
