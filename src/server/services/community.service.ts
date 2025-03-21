import { client } from '@/lib/db';
import { ApiError } from '@/lib/error';

// 帖子相关接口
interface CreatePostParams {
  title: string;
  content: string;
  tags?: string[];
  userId: string;
}

interface PostFilter {
  tag?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'popular';
}

// 评论相关接口
interface CreateCommentParams {
  postId: string;
  content: string;
  userId: string;
  parentId?: string;
}

// 点赞相关接口
interface LikeParams {
  postId: string;
  userId: string;
}

export class CommunityService {
  // 创建新帖子
  async createPost(params: CreatePostParams) {
    const { title, content, tags = [], userId } = params;

    if (!title.trim()) {
      throw new ApiError('标题不能为空', 400);
    }

    if (!content.trim()) {
      throw new ApiError('内容不能为空', 400);
    }

    if (!userId) {
      throw new ApiError('用户ID不能为空', 400);
    }

    try {
      // 修复查询语法，使用 <uuid> 类型转换而不是 <str>
      const posts = await client.query(
        `
        with 
          user := (select User filter .id = <uuid>$userId limit 1),
          post := (
            insert community::Post {
              title := <str>$title,
              content := <str>$content,
              tags := <array<str>>$tags,
              author := user
            }
          )
        select post {
          id,
          title,
          content,
          tags,
          created_at,
          author: {
            id,
            username,
            nickname
          }
        }
        `,
        { title, content, tags, userId }
      );

      if (!posts.length) {
        throw new ApiError('创建帖子失败', 500);
      }

      return posts[0];
    } catch (error) {
      console.error('创建帖子错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      // 处理EdgeDB特定错误
      if (error instanceof Error) {
        if (error.message.includes('InvalidReferenceError')) {
          throw new ApiError('用户不存在或ID格式错误', 400);
        } else if (error.message.includes('NoDataError')) {
          throw new ApiError('用户不存在', 404);
        }
      }
      throw new ApiError('创建帖子失败', 500);
    }
  }

  // 获取帖子列表
  async getPosts(filter: PostFilter = {}) {
    const { tag, authorId, page = 1, limit = 10, sortBy = 'latest' } = filter;
    const offset = (page - 1) * limit;

    let query = `
      with posts := (
        select community::Post {
          id,
          title,
          content,
          tags,
          created_at,
          view_count,
          author: {
            id,
            username,
            nickname,
          },
          comments: { id } limit 100,
          likes: { id } limit 100
        }
    `;

    const params: Record<string, unknown> = { limit, offset };

    // 添加过滤条件
    if (tag) {
      query += ` filter <str>$tag in .tags`;
      params.tag = tag;
    }

    if (authorId) {
      query += `${tag ? ' and' : ' filter'} .author.id = <uuid>$authorId`;
      params.authorId = authorId;
    }

    // 添加排序
    if (sortBy === 'latest') {
      query += ` order by .created_at desc`;
    } else if (sortBy === 'popular') {
      query += ` order by .view_count desc`;
    }

    query += `
      )
      select posts {
        id,
        title,
        content,
        tags,
        created_at,
        view_count,
        author: {
          id,
          username,
          nickname,
        },
        comment_count := count(.comments),
        like_count := count(.likes)
      }
      offset <int64>$offset
      limit <int64>$limit
    `;

    try {
      const posts = await client.query(query, params);

      // 修复计数查询，只在有过滤条件时传递参数
      let countQuery = `select count(community::Post)`;
      const countParams: Record<string, unknown> = {};

      if (tag) {
        countQuery += ` filter <str>$tag in .tags`;
        countParams.tag = tag;
      }

      if (authorId) {
        countQuery += `${tag ? ' and' : ' filter'} .author.id = <uuid>$authorId`;
        countParams.authorId = authorId;
      }

      const countResult = await client.query(
        countQuery,
        Object.keys(countParams).length > 0 ? countParams : undefined
      );
      const total = (countResult[0] || 0) as number;

      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('获取帖子列表错误:', error);
      throw new ApiError('获取帖子列表失败', 500);
    }
  }

  // 获取单个帖子详情
  async getPostById(postId: string) {
    try {
      const posts = await client.query(
        `
        select community::Post {
          id,
          title,
          content,
          tags,
          created_at,
          updated_at,
          view_count,
          author: {
            id,
            username,
            nickname,
          },
          comments: {
            id,
            content,
            created_at,
            author: {
              id,
              username,
              nickname,
            },
            parent_comment: {
              id,
              author: {
                id,
                username,
                nickname
              }
            }
          } order by .created_at desc,
          likes: {
            id
          }
        }
        filter .id = <uuid>$postId
        limit 1
        `,
        { postId }
      );

      if (!posts.length) {
        throw new ApiError('帖子不存在', 404);
      }

      // 增加浏览量
      await client.query(
        `
        update community::Post 
        filter .id = <uuid>$postId
        set {
          view_count := .view_count + 1
        }
        `,
        { postId }
      );

      return posts[0];
    } catch (error) {
      console.error('获取帖子详情错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取帖子详情失败', 500);
    }
  }

  // 添加评论
  async createComment(params: CreateCommentParams) {
    const { postId, content, userId, parentId } = params;

    if (!content.trim()) {
      throw new ApiError('评论内容不能为空', 400);
    }

    try {
      let query = `
        with 
          user := (select User filter .id = <uuid>$userId limit 1),
          post := (select Post filter .id = <uuid>$postId limit 1)
      `;

      const queryParams: Record<string, unknown> = {
        postId,
        content,
        userId,
      };

      if (parentId) {
        query += `,
          parent := (select Comment filter .id = <uuid>$parentId limit 1)
        `;
        queryParams.parentId = parentId;
      }

      query += `
        insert Comment {
          content := <str>$content,
          author := user,
          post := post
          ${parentId ? ', parent_comment := parent' : ''}
        }
      `;

      const comments = await client.query(query, queryParams);

      if (!comments.length) {
        throw new ApiError('添加评论失败', 500);
      }

      return comments[0];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('添加评论失败', 500);
    }
  }

  // 点赞/取消点赞
  async toggleLike(params: LikeParams) {
    const { postId, userId } = params;

    try {
      // 检查是否已点赞
      const existingLikes = await client.query(
        `
        select PostLike {
          id
        }
        filter 
          .post.id = <uuid>$postId and
          .user.id = <uuid>$userId
        limit 1
        `,
        { postId, userId }
      );

      if (existingLikes.length > 0) {
        // 已点赞，取消点赞
        await client.query(
          `
          delete PostLike
          filter 
            .post.id = <uuid>$postId and
            .user.id = <uuid>$userId
          `,
          { postId, userId }
        );
        return { liked: false };
      } else {
        // 未点赞，添加点赞
        await client.query(
          `
          with 
            user := (select User filter .id = <uuid>$userId limit 1),
            post := (select Post filter .id = <uuid>$postId limit 1)
          insert PostLike {
            user := user,
            post := post
          }
          `,
          { postId, userId }
        );
        return { liked: true };
      }
    } catch {
      throw new ApiError('操作失败', 500);
    }
  }

  // 获取热门标签
  async getPopularTags(limit: number = 10) {
    try {
      // 这里需要根据实际数据库结构调整查询
      // 以下是一个示例实现
      const tags = await client.query(
        `
        with 
          all_tags := (
            select Post.tags
          ),
          flattened_tags := (
            select array_unpack(all_tags)
          ),
          tag_counts := (
            select flattened_tags, count(flattened_tags)
            group by flattened_tags
          )
        select {
          name := tag_counts.flattened_tags,
          count := tag_counts.count
        }
        order by .count desc
        limit <int64>$limit
        `,
        { limit }
      );

      return tags;
    } catch {
      throw new ApiError('获取热门标签失败', 500);
    }
  }
}

export const communityService = new CommunityService();
