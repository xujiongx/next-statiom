import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';
import { getUserId } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function POST(request: NextRequest, context: RouteParams) {
  return withErrorHandler(async () => {
    const params = await context.params;
    console.log('🥽', params);
    const { id } = params;
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json(
        {
          code: 401,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    const result = await communityService.toggleLike({
      postId: id,
      userId,
    });

    return Response.json({
      code: 0,
      data: {
        liked: result.liked,
      },
    });
  });
}
