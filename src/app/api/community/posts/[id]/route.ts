import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(request: NextRequest, context: RouteParams) {
  return withErrorHandler(async () => {
    const params = await context.params;
    const { id } = params;
    if (!id) {
      return Response.json(
        {
          code: 400,
          message: '帖子ID不能为空',
        },
        { status: 400 }
      );
    }

    const post = await communityService.getPostById(id);

    return Response.json({
      code: 0,
      data: post,
    });
  });
}
