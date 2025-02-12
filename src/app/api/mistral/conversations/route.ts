import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { mistralService } from '@/server/services/mistral.service';

export const GET = () => {
  return withErrorHandler(async () => {
    const result = await mistralService.getConversationList();
    return NextResponse.json(result);
  });
};
