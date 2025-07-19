import { client } from '@/lib/db';
import { ApiError } from '@/lib/error';
import { Favorite } from '@/api/favorites';

export interface CreateFavoriteParams {
  title: string;
  url: string;
  category: string;
  userId: string;
}


export class FavoriteService {
  /**
   * 获取用户的收藏列表
   * @param userId 用户ID
   * @returns Promise<Favorite[]>
   */
  async getFavorites(userId: string): Promise<Favorite[]> {
    try {
      const favorites = await client.query<Favorite>(
        `
        SELECT Favorite {
          id,
          title,
          url,
          category,
          created_at
        }
        FILTER .user.id = <uuid>$userId
        ORDER BY .created_at DESC
        `,
        { userId }
      );

      return favorites.map(favorite => ({
        id: favorite.id,
        title: favorite.title,
        url: favorite.url,
        category: favorite.category,
        created_at: favorite.created_at.toString()
      }));
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建新收藏
   * @param params 创建收藏参数
   * @returns Promise<Favorite>
   */
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
      const result = await client.query<{ id: string }>(
        `
        WITH user := (SELECT User FILTER .id = <uuid>$userId LIMIT 1)
        INSERT Favorite {
          title := <str>$title,
          url := <str>$url,
          category := <str>$category,
          user := user
        }
        `,
        { title, url, category, userId }
      );

      if (!result.length) {
        throw new ApiError('创建收藏失败', 500);
      }

      // 获取创建的收藏详情
      const favorite = await client.querySingle<Favorite>(
        `
        SELECT Favorite {
          id,
          title,
          url,
          category,
          created_at
        }
        FILTER .id = <uuid>$id
        LIMIT 1
        `,
        { id: result[0].id }
      );

      if (!favorite) {
        throw new ApiError('获取收藏详情失败', 500);
      }

      return {
        id: favorite.id,
        title: favorite.title,
        url: favorite.url,
        category: favorite.category,
        created_at: favorite.created_at.toString()
      };
    } catch (error) {
      console.error('创建收藏失败:', error);
      throw error;
    }
  }

  /**
   * 删除收藏
   * @param favoriteId 收藏ID
   * @param userId 用户ID
   * @returns Promise<void>
   */
  async deleteFavorite(favoriteId: string, userId: string): Promise<void> {
    try {
      // 验证收藏是否属于当前用户
      const favorite = await client.querySingle(
        `
        SELECT Favorite {
          id
        }
        FILTER .id = <uuid>$favoriteId AND .user.id = <uuid>$userId
        LIMIT 1
        `,
        { favoriteId, userId }
      );

      if (!favorite) {
        throw new ApiError('收藏不存在或无权限删除', 404);
      }

      // 删除收藏
      await client.query(
        `
        DELETE Favorite
        FILTER .id = <uuid>$favoriteId
        `,
        { favoriteId }
      );
    } catch (error) {
      console.error('删除收藏失败:', error);
      throw error;
    }
  }
}

export const favoriteService = new FavoriteService();