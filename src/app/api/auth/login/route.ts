import { NextResponse } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { withErrorHandler } from '@/lib/api';
import { LoginParams } from '@/types/auth';

export const POST = (request: Request) => {
  return withErrorHandler(async () => {
    const body = await request.json() as LoginParams;
    const data = await authService.login(body);
    
    return NextResponse.json({
      code: 0,
      data,
      message: '登录成功'
    });
  });
};