import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 检查 API 路由
  if (request.nextUrl.pathname.startsWith('/api')) {
    // 添加安全相关的响应头
    const headers = new Headers(request.headers);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // API 鉴权检查
    if (request.nextUrl.pathname.startsWith('/api/mistral')) {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json(
          { code: 401, message: '未授权访问' },
          { 
            status: 401,
            headers: {
              'X-Redirect': '/login'
            }
          }
        );
      }
    }

    return NextResponse.next({
      headers: headers,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};