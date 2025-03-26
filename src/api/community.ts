import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';
import { MyComment, Post } from '@/types/community';

export interface CreatePostParams {
  title: string;
  content: string;
  tags?: string[];
}

export interface PostsFilter {
  page?: number;
  limit?: number;
  tag?: string;
  sort?: 'latest' | 'popular';
  filter?: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Stats {
  total_users: 0;
  total_posts: 0;
  active_users_this_week: 0;
}

export const communityApi = {
  // 获取帖子列表
  getPosts: (params: PostsFilter = {}): Promise<ApiResponse<PostsResponse>> => {
    return http.get('/community/posts', { params });
  },

  // 创建新帖子
  createPost: (params: CreatePostParams): Promise<ApiResponse<Post>> => {
    return http.post('/community/posts', params);
  },

  // 获取帖子详情
  getPostById: (id: string): Promise<ApiResponse<Post>> => {
    return http.get(`/community/posts/${id}`);
  },

  // 点赞/取消点赞帖子
  toggleLike: (id: string): Promise<ApiResponse<{ liked: boolean }>> => {
    return http.post(`/community/posts/${id}/like`);
  },

  // 获取热门标签
  getPopularTags: (
    limit?: number
  ): Promise<
    ApiResponse<{ name: string; count: number; post_count: number }[]>
  > => {
    return http.get('/community/tags', { params: { limit } });
  },

  // 添加评论
  addComment: (
    postId: string,
    content: string,
    parentId?: string
  ): Promise<ApiResponse<unknown>> => {
    return http.post(`/community/posts/${postId}/comments`, {
      content,
      parentId,
    });
  },

  // 获取帖子评论
  getPostComments: (
    postId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<{
    comments: MyComment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  }>> => {
    return http.get(`/community/posts/${postId}/comments`, {
      params: { page, limit }
    });
  },

  // 删除帖子
  deletePost: (id: string): Promise<ApiResponse<void>> => {
    return http.delete(`/community/posts/${id}`);
  },

  // 获取社区统计数据
  getCommunityStats: (): Promise<ApiResponse<Stats>> => {
    return http.get('/community/stats');
  },

  // 删除评论
  deleteComment: (commentId: string): Promise<ApiResponse<void>> => {
    return http.delete(`/community/comments/${commentId}`);
  },
};
