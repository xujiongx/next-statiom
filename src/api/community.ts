import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface Author {
  id: string;
  nickname: string;
  image: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  like_count: number;
  is_liked: boolean;
  tags: string[];
  author: Author;
  comments: unknown[];
  likes: unknown[];
}

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
  getPopularTags: (): Promise<
    ApiResponse<{ name: string; count: number }[]>
  > => {
    return http.get('/community/tags/popular');
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
};
