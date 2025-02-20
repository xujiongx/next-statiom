import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { mistralService } from '@/server/services/mistral.service';

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(request: NextRequest, context: RouteParams) {
  return withErrorHandler(async () => {
    const params = await context.params;
    const result = await mistralService.getConversationMessages(
      params.sessionId
    );
    return NextResponse.json(result);
  });
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  return withErrorHandler(async () => {
    const params = await context.params;
    await mistralService.deleteConversation(params.sessionId);
    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  });
}
