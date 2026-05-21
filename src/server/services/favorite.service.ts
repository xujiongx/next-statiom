import { prisma } from '@/lib/db';
import { ApiError } from '@/lib/error';
import { Favorite } from '@/api/favorites';

export interface CreateFavoriteParams {
  title: string;
  url: string;
  category: string;
  userId: string;
}

export class FavoriteService {
  async getFavorites(userId: string): Promise<Favorite[]> {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          url: true,
          category: true,
          createdAt: true,
        },
      });

      return favorites.map((favorite) => ({
        id: favorite.id,
        title: favorite.title,
        url: favorite.url,
        category: favorite.category,
        created_at: favorite.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      throw error;
    }
  }

  async createFavorite(params: CreateFavoriteParams): Promise<Favorite> {
    const { title, url, category, userId } = params;

    if (!title.trim()) {
      throw new ApiError('标题不能为空', 400);
    }

    if (!url.trim()) {
      throw new ApiError('URL不能为空', 400);
    }

    if (!category.trim()) {
      throw new ApiError('分类不能为空', 400);
    }

    try {
      const favorite = await prisma.favorite.create({
        data: {
          title,
          url,
          category,
          userId,
        },
        select: {
          id: true,
          title: true,
          url: true,
          category: true,
          createdAt: true,
        },
      });

      return {
        id: favorite.id,
        title: favorite.title,
        url: favorite.url,
        category: favorite.category,
        created_at: favorite.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('创建收藏失败:', error);
      throw error;
    }
  }

  async deleteFavorite(favoriteId: string, userId: string): Promise<void> {
    try {
      const favorite = await prisma.favorite.findFirst({
        where: {
          id: favoriteId,
          userId,
        },
        select: { id: true },
      });

      if (!favorite) {
        throw new ApiError('收藏不存在或无权限删除', 404);
      }

      await prisma.favorite.delete({
        where: { id: favoriteId },
      });
    } catch (error) {
      console.error('删除收藏失败:', error);
      throw error;
    }
  }
}

export const favoriteService = new FavoriteService();
