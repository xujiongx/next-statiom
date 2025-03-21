import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';

export const GET = (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  return withErrorHandler(async () => {
    const params = await context.params
    const id = params.id
    console.log('🤤', id)
    if (!id) {
      return NextResponse.json(
        {
          code: 400,
          message: '帖子ID不能为空',
        },
        { status: 400 }
      );
    }

    const post = await communityService.getPostById(id);

    return NextResponse.json({
      code: 0,
      data: post,
    });
  });
};
