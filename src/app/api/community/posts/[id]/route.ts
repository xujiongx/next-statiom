import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';
import { getServerSession } from '@/lib/auth';
import { client } from '@/lib/db';
import { ApiError } from '@/lib/error';

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

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const session = await getServerSession();
    if (!session?.user) {
      throw new ApiError('未登录', 401);
    }

    const postId = params.id;
    const userId = session.user.id;

    // 检查帖子是否存在且是否为作者
    const posts = await client.query(
      `
      select community::Post {
        id,
        author: { id }
      }
      filter .id = <uuid>$postId and .author.id = <uuid>$userId
      limit 1
      `,
      { postId, userId }
    );

    if (!posts.length) {
      throw new ApiError('帖子不存在或无权限删除', 403);
    }

    // 删除帖子及其关联数据
    await client.query(
      `
      # 先解除帖子对评论的引用
      update community::Post
      filter .id = <uuid>$postId
      set {
        comments := {}
      };
      
      # 再删除所有关联的评论
      delete community::Comment
      filter .post.id = <uuid>$postId;
      
      # 最后删除帖子
      delete community::Post
      filter .id = <uuid>$postId and .author.id = <uuid>$userId;
      `,
      { postId, userId }
    );

    return Response.json({ code: 0, message: '删除成功' });
  } catch (error) {
    console.error('删除帖子错误:', error);
    if (error instanceof ApiError) {
      return Response.json(
        { code: error.code, message: error.message },
        { status: error.code }
      );
    }
    return Response.json(
      { code: 500, message: '删除帖子失败' },
      { status: 500 }
    );
  }
}
