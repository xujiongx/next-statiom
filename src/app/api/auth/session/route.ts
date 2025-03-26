import { NextResponse } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { withErrorHandler } from '@/lib/api';

export const GET = (request: Request) => {
  return withErrorHandler(async () => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        code: 0,
        data: {
          user: null,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        message: '未登录',
      });
    }

    const user = await authService.getUserByToken(token);

    return NextResponse.json({
      code: 0,
      data: {
        user,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      message: '获取会话成功',
    });
  });
};
