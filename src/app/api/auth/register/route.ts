import { NextResponse } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { withErrorHandler } from '@/lib/api';

interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
}

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json() as RegisterParams;
    const data = await authService.register(body);
    
    return NextResponse.json({
      code: 0,
      data,
      message: '注册成功'
    });
  });
}