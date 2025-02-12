import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { mistralService } from '@/server/services/mistral.service';

export const GET = (request: Request) => {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const content = searchParams.get('content');
    const sessionId = searchParams.get('sessionId');

    if (!content || !sessionId) {
      return NextResponse.json(
        { code: 400, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    const response = await mistralService.getMistralResponse({
      content,
      sessionId,
    });

    return NextResponse.json({
      code: 0,
      data: response,
    });
  });
};