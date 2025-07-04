import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { ImageType, PixabayService } from '@/server/services/pixabay.service';

const pixabayService = new PixabayService();

// 添加响应数据的接口定义
interface ApiResponse {
  code: number;
  data?: {
    images: ImageType[];
    pagination: {
      limit: number;
      offset: number;
      count: number;
    };
  };
  message?: string;
}

export const GET = (request: NextRequest) => {
  return withErrorHandler(async () => {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');
      const offset = parseInt(searchParams.get('offset') || '0');

      // 验证参数
      if (limit < 1 || limit > 100) {
        return NextResponse.json(
          { code: 400, message: 'limit 参数必须在 1-100 之间' } as ApiResponse,
          { status: 400 }
        );
      }

      if (offset < 0) {
        return NextResponse.json(
          { code: 400, message: 'offset 参数不能为负数' } as ApiResponse,
          { status: 400 }
        );
      }

      const images = await pixabayService.getImagesFromDatabase(limit, offset);
      
      return NextResponse.json({
        code: 0,
        data: {
          images,
          pagination: {
            limit,
            offset,
            count: images.length
          }
        }
      } as ApiResponse);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取图片列表失败，请稍后重试';
      console.error('Get images error:', error);
      
      return NextResponse.json({
        code: 500,
        message: errorMessage,
      } as ApiResponse);
    }
  });
};