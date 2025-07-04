import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

interface ImageType {
  id: string;
  url: string;
  created_at: string;
}

interface GetImagesParams {
  limit?: number;
  offset?: number;
}

export const imageApi = {
  // 获取图片列表
  getImages: (params?: GetImagesParams): Promise<ApiResponse<{ 
    images: ImageType[];
    pagination: {
      limit: number;
      offset: number;
      count: number;
    }
  }>> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    const url = queryString ? `/image/list?${queryString}` : '/image/list';
    
    return http.get(url);
  }
};