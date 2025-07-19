import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface Favorite {
  id: string;
  title: string;
  url: string;
  category: string;
  created_at: string;
}

export interface CreateFavoriteParams {
  title: string;
  url: string;
  category: string;
}

export const favoritesApi = {
  // 获取收藏列表
  getFavorites: (): Promise<ApiResponse<{ favorites: Favorite[] }>> => {
    return http.get('/favorites');
  },

  // 创建收藏
  createFavorite: (params: CreateFavoriteParams): Promise<ApiResponse<{ favorite: Favorite }>> => {
    return http.post('/favorites', params);
  },

  // 删除收藏
  deleteFavorite: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return http.delete(`/favorites/${id}`);
  },
};