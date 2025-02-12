import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { withErrorHandler } from '@/lib/api';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
    const userInfo = await authService.getCurrentUser(token);
    
    return NextResponse.json({
      code: 0,
      data: userInfo,
      message: '获取成功'
    });
  });
}