import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ApiError } from '@/lib/error';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const session = await getServerSession();
    if (!session?.user) {
      throw new ApiError('未登录', 401);
    }

    const commentId = params.id;
    const userId = session.user.id;

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: userId,
      },
      select: { id: true },
    });

    if (!comment) {
      throw new ApiError('评论不存在或无权限删除', 403);
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return Response.json({ code: 0, message: '删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    if (error instanceof ApiError) {
      return Response.json(
        { code: error.code, message: error.message },
        { status: error.code }
      );
    }
    return Response.json(
      { code: 500, message: '删除评论失败' },
      { status: 500 }
    );
  }
}
