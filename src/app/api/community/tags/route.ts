import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';

// 获取所有标签
export const GET = (request: NextRequest) => {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // 使用服务层获取标签列表
    const tags = await communityService.getPopularTags(limit);
    

    return NextResponse.json({
      code: 0,
      data: tags,
    });
  });
};