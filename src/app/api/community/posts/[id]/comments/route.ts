import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';
import { getServerSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

// 获取帖子评论
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

    // 获取分页参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const comments = await communityService.getPostComments(id, page, limit);

    return Response.json({
      code: 0,
      data: comments,
    });
  });
}

// 创建评论
export async function POST(request: NextRequest, context: RouteParams) {
  return withErrorHandler(async () => {
    const params = await context.params;
    const { id: postId } = params;
    if (!postId) {
      return Response.json(
        {
          code: 400,
          message: '帖子ID不能为空',
        },
        { status: 400 }
      );
    }

    // 获取当前登录用户
    const session = await getServerSession();
    console.log('👩‍🦱', session);
    if (!session || !session.user) {
      return Response.json(
        {
          code: 401,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      return Response.json(
        {
          code: 400,
          message: '评论内容不能为空',
        },
        { status: 400 }
      );
    }

    const comment = await communityService.createComment({
      postId,
      content,
      userId,
      parentId,
    });

    return Response.json({
      code: 0,
      data: comment,
      message: '评论成功',
    });
  });
}