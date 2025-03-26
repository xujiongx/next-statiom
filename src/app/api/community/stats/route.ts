import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { communityService } from '@/server/services/community.service';

// 获取社区统计数据
export const GET = () => {
  return withErrorHandler(async () => {
    // 使用服务层获取社区统计数据
    const stats = await communityService.getCommunityStats();

    return NextResponse.json({
      code: 0,
      data: stats,
    });
  });
};
