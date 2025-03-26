import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';
import { getUserId } from '@/lib/auth';

// 获取帖子列表
export const GET = (request: NextRequest) => {
  return withErrorHandler(async () => {
    const userId = await getUserId(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag') || undefined;
    const sortBy = searchParams.get('sortBy') || 'latest';

    // 使用服务层获取帖子列表
    const result = await communityService.getPosts({
      page,
      limit,
      tag,
      sortBy: sortBy as 'latest' | 'popular',
      userId,
    });

    return NextResponse.json({
      code: 0,
      data: result,
    });
  });
};

// 创建新帖子
export const POST = (request: NextRequest) => {
  return withErrorHandler(async () => {
    const userId = await getUserId(request);

    const body = await request.json();

    // 验证请求数据
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          code: 400,
          message: '标题和内容不能为空',
        },
        { status: 400 }
      );
    }

    // 使用服务层创建新帖子
    const newPost = await communityService.createPost({
      title: body.title,
      content: body.content,
      tags: body.tags || [],
      userId: userId,
    });

    return NextResponse.json(
      {
        code: 0,
        data: newPost,
      },
      { status: 201 }
    );
  });
};
