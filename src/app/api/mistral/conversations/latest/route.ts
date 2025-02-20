import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { mistralService } from '@/server/services/mistral.service';
import { getUserId } from '@/lib/auth';

export const GET = (request: Request) => {
  return withErrorHandler(async () => {
    const userId = await getUserId(request);
    const result = await mistralService.getLatestConversation(userId);
    return NextResponse.json(result);
  });
};