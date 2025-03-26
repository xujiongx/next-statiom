import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { client } from '@/lib/db';
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

    // 检查评论是否存在且是否为作者
    const comments = await client.query(
      `
      select community::Comment {
        id,
        author: { id }
      }
      filter .id = <uuid>$commentId and .author.id = <uuid>$userId
      limit 1
      `,
      { commentId, userId }
    );

    if (!comments.length) {
      throw new ApiError('评论不存在或无权限删除', 403);
    }

    // 删除评论
    await client.query(
      `
      with comment := (
        select community::Comment {
          id,
          post: { id }
        }
        filter .id = <uuid>$commentId
        limit 1
      )
      update community::Post
      filter .id = comment.post.id
      set {
        comments -= (
          select community::Comment
          filter .id = <uuid>$commentId
        )
      };

      delete community::Comment
      filter .id = <uuid>$commentId and .author.id = <uuid>$userId;
      `,
      { commentId, userId }
    );

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