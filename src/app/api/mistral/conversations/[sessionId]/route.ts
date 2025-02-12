import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { mistralService } from '@/server/services/mistral.service';

export const GET = (
  request: Request,
  { params }: { params: { sessionId: string } }
) => {
  return withErrorHandler(async () => {
    const result = await mistralService.getConversationHistory(params.sessionId);
    return NextResponse.json(result);
  });
}

export const DELETE = (
  request: Request,
  { params }: { params: { sessionId: string } }
) => {
  return withErrorHandler(async () => {
    await mistralService.deleteConversation(params.sessionId);
    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  });
};