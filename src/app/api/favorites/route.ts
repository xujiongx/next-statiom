import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { getServerSession } from '@/lib/auth';
import { favoriteService } from '@/server/services/favorite.service';
import { Favorite } from '@/api/favorites';

// 添加响应数据的接口定义
interface ApiResponse {
  code: number;
  data?: {
    favorites?: Favorite[];
    favorite?: Favorite;
    message?: string;
  };
  message?: string;
}

// 获取收藏列表
export const GET = () => {
  return withErrorHandler(async () => {
    try {
      const session = await getServerSession();
      if (!session?.user) {
        return NextResponse.json(
          { code: 401, message: '未授权访问' } as ApiResponse,
          { status: 401 }
        );
      }

      const userId = session.user.id;
      const favorites = await favoriteService.getFavorites(userId);

      return NextResponse.json({
        code: 0,
        data: { favorites }
      } as ApiResponse);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取收藏列表失败，请稍后重试';
      console.error('获取收藏列表失败:', error);
      
      return NextResponse.json({
        code: 500,
        message: errorMessage,
      } as ApiResponse, { status: 500 });
    }
  });
};

// 创建收藏
export const POST = (request: NextRequest) => {
  return withErrorHandler(async () => {
    try {
      const session = await getServerSession();
      if (!session?.user) {
        return NextResponse.json(
          { code: 401, message: '未授权访问' } as ApiResponse,
          { status: 401 }
        );
      }

      const userId = session.user.id;
      const { title, url, category } = await request.json();

      // 验证参数
      if (!title) {
        return NextResponse.json(
          { code: 400, message: '标题不能为空' } as ApiResponse,
          { status: 400 }
        );
      }

      if (!url) {
        return NextResponse.json(
          { code: 400, message: 'URL不能为空' } as ApiResponse,
          { status: 400 }
        );
      }

      if (!category) {
        return NextResponse.json(
          { code: 400, message: '分类不能为空' } as ApiResponse,
          { status: 400 }
        );
      }

      const favorite = await favoriteService.createFavorite({
        title,
        url,
        category,
        userId
      });

      return NextResponse.json({
        code: 0,
        data: { favorite }
      } as ApiResponse);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '创建收藏失败，请稍后重试';
      console.error('创建收藏失败:', error);
      
      return NextResponse.json({
        code: 500,
        message: errorMessage,
      } as ApiResponse, { status: 500 });
    }
  });
};