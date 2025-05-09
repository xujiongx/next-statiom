import { NextRequest, NextResponse } from 'next/server';
import { openRouterService } from '@/server/services/openrouter.service';
import { getServerSession } from '@/lib/auth';
import { ApiError } from '@/lib/error';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('😨', session);
    if (!session?.user) {
      return NextResponse.json(
        { code: 401, message: '未授权访问' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { content, sessionId, model } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { code: 400, message: '内容不能为空' },
        { status: 400 }
      );
    }
    
    if (!sessionId) {
      return NextResponse.json(
        { code: 400, message: '会话ID不能为空' },
        { status: 400 }
      );
    }
    
    const response = await openRouterService.getOpenRouterResponse({
      content,
      sessionId,
      userId,
      model
    });
    
    return NextResponse.json({
      code: 0,
      data: response
    });
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    if (error instanceof ApiError) {
      return Response.json(
        { code: error.code, message: error.message },
        { status: error.code }
      );
    }
    
    return NextResponse.json(
      { code: 500, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}