import { UploadedImage } from '@/components/ui/image-upload';
import { getServerSession } from '@/lib/auth';
import { client } from '@/lib/db';
import { ApiError } from '@/lib/error';
import { MyComment, Post } from '@/types/community';

interface QueryResult {
  total: number;
  comments: MyComment[];
}
// 帖子相关接口
interface CreatePostParams {
  title: string;
  content: string;
  tags?: string[];
  images?: UploadedImage[];
  userId: string;
}

interface PostFilter {
  tag?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'popular' | 'following';
  userId?: string;
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

interface UpdatePostParams {
  postId: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  images?: UploadedImage[]; // 新增 images 字段
}

export class CommunityService {
  // 创建新帖子
  async createPost(params: CreatePostParams) {
    const { title, content, tags = [], images = [], userId } = params;

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
              images := <json>$images,
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
        { title, content, tags, images: JSON.stringify(images), userId }
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
    const {
      tag,
      authorId,
      page = 1,
      limit = 10,
      sortBy = 'latest',
      userId,
    } = filter;

    console.log('🕵️‍♂️', filter);
    const offset = (page - 1) * limit;

    // 修改参数传递方式
    const params: Record<string, unknown> = {
      offset,
      limit,
      ...(userId && { userId }),
      ...(tag && { tag }),
      ...(authorId && { authorId }),
    };

    const filterConditions: string[] = [];
    if (tag) {
      filterConditions.push('contains(.tags, <str>$tag)');
    }
    if (authorId) {
      filterConditions.push('.author.id = <uuid>$authorId');
    }
    // 修改点赞筛选逻辑
    if (sortBy === 'following' && userId) {
      filterConditions.push('<uuid>$userId in .likes.id');
    }

    const filterClause = filterConditions.length
      ? ` filter ${filterConditions.join(' and ')}`
      : '';

    // 修改排序逻辑
    const orderClause =
      sortBy === 'popular'
        ? ' order by (count(.likes) * 2 + count(.comments) * 3 + .view_count) desc then .created_at desc'
        : ' order by .created_at desc';

    const query = `
      with post := (
        select community::Post {
          id,
          title,
          content,
          tags,
          images,
          created_at,
          view_count,
          author: {
            id,
            username,
            nickname,
          },
          comments: { id },
          likes: { id },
          score := (
            count(.likes) * 2 +
            count(.comments) * 3 +
            .view_count
          )
        }${filterClause}${orderClause}
        offset <int64>$offset
        limit <int64>$limit
      )
      select post {
        id,
        title,
        content,
        tags,
        images,
        created_at,
        view_count,
        author: {
          id,
          username,
          nickname,
        },
        comment_count := count(.comments),
        new_comment := (
          select .comments {
            id,
            content,
            created_at,
            author: {
              id,
              username,
              nickname
            }
          } 
          order by .created_at desc
          limit 1
        ),
        like_count := count(.likes),
        is_liked := <bool>(exists (
          select .likes filter .id = <uuid>$userId
        ))
      }
    `;

    try {
      const posts = (await client.query(query, params)) as Post[];

      // 解析每个帖子的 images 字段
      for (const post of posts) {
        if (post.images && typeof post.images === 'string') {
          try {
            post.images = JSON.parse(post.images);
          } catch (e) {
            console.error('解析帖子图片数据失败:', e);
            post.images = [];
          }
        }
      }

      // 修改计数查询和参数
      const countQuery = `
        with post := (
          select community::Post {
            id
          }${filterClause}
        )
        select count(post)
      `;

      // 只传递过滤条件需要的参数
      const countParams: Record<string, unknown> = {};
      if (tag) {
        countParams.tag = tag;
      }
      if (authorId) {
        countParams.authorId = authorId;
      }
      if (sortBy === 'following' && userId) {
        countParams.userId = userId;
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
    const session = await getServerSession();
    console.log('👩', session?.user?.id);
    const userId = session?.user?.id;

    try {
      const posts = await client.query(
        `
        select community::Post {
          id,
          title,
          content,
          tags,
          images,
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
          },
          like_count := count(.likes),
          is_liked := <bool>(
          exists (
            select .likes filter .id = <uuid>$userId
          )
        )
        }
        filter .id = <uuid>$postId
        limit 1
        `,
        { postId, userId }
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

      // 解析 images 字段
      const post = posts[0] as Post;
      if (post.images && typeof post.images === 'string') {
        try {
          post.images = JSON.parse(post.images);
        } catch (e) {
          console.error('解析帖子图片数据失败:', e);
          post.images = [];
        }
      }

      return post;
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
      const query = `
        with 
          user := (select default::User filter .id = <uuid>$userId limit 1),
          post := (select community::Post filter .id = <uuid>$postId limit 1),
          comment := (
            insert community::Comment {
              content := <str>$content,
              author := user,
              post := post
              ${
                parentId
                  ? ', parent_comment := (select detached community::Comment filter .id = <uuid>$parentId limit 1)'
                  : ''
              }
            }
          )
        select (
          update post
          set {
            comments += comment
          }
        ) {
          comments: {
            id,
            content,
            created_at,
            author: {
              id,
              username,
              nickname
            },
            parent_comment: {
              id,
              author: {
                id,
                username,
                nickname
              },
              content,
              created_at,
            }
          } filter .id = comment.id
        }
      `;

      const result: { comments: MyComment[] }[] = await client.query(query, {
        postId,
        content,
        userId,
        ...(parentId && { parentId }),
      });

      if (!result.length || !result[0].comments.length) {
        throw new ApiError('添加评论失败', 500);
      }

      return result[0].comments[0];
    } catch (error) {
      console.error('添加评论错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.message.includes('InvalidReferenceError')) {
          throw new ApiError('用户或帖子不存在', 400);
        }
      }
      throw new ApiError('添加评论失败', 500);
    }
  }

  // 点赞/取消点赞
  async toggleLike(params: LikeParams) {
    const { postId, userId } = params;

    try {
      // 检查是否已点赞
      const existingLikes: { id: string; has_liked: boolean }[] =
        await client.query(
          `
        select community::Post {
          id,
          has_liked := <uuid>$userId in .likes.id
        }
        filter .id = <uuid>$postId
        limit 1
        `,
          { postId, userId }
        );

      if (existingLikes.length > 0 && existingLikes[0]?.has_liked) {
        // 已点赞，取消点赞
        await client.query(
          `
          update community::Post
          filter .id = <uuid>$postId
          set {
            likes -= (
              select default::User
              filter .id = <uuid>$userId
            )
          }
          `,
          { postId, userId }
        );
        return { liked: false };
      } else {
        // 未点赞，添加点赞
        const result = await client.query(
          `
          update community::Post
          filter .id = <uuid>$postId
          set {
            likes += (
              select default::User
              filter .id = <uuid>$userId
            )
          }
          `,
          { postId, userId }
        );

        if (!result.length) {
          throw new ApiError('点赞失败', 500);
        }

        return { liked: true };
      }
    } catch (error) {
      console.error('点赞操作错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      // 处理EdgeDB特定错误
      if (error instanceof Error) {
        if (error.message.includes('InvalidReferenceError')) {
          throw new ApiError('用户或帖子不存在', 400);
        }
      }
      throw new ApiError('操作失败', 500);
    }
  }

  // 获取热门标签
  async getPopularTags(limit: number = 10) {
    try {
      const tags = await client.query(
        `
        select (
          with 
            all_tags := (
              select array_unpack(community::Post.tags)
            ),
            distinct_tags := (
              select distinct all_tags
            )
          for tag in distinct_tags
          union (
            select {
              name := tag,
              count := count(all_tags filter all_tags = tag)
            }
          )
        )
        order by .count desc
        limit <int64>$limit
        `,
        { limit }
      );

      return tags;
    } catch (error) {
      console.error('获取热门标签错误:', error);
      throw new ApiError('获取热门标签失败', 500);
    }
  }

  // 获取帖子评论
  async getPostComments(postId: string, page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      const result = await client.query<QueryResult>(
        `
        with post := (
          select community::Post 
          filter .id = <uuid>$postId
          limit 1
        )
        select {
          total := count(post.comments),
          comments := (
            select post.comments {
              id,
              content,
              created_at,
              author: {
                id,
                username,
                nickname
              },
              parent_comment: {
                id,
                author: {
                  id,
                  username,
                  nickname
                },
                content,
                created_at
              }
            }
            order by .created_at desc
            offset <int64>$offset
            limit <int64>$limit
          )
        }
        `,
        { postId, offset, limit }
      );

      if (!result.length) {
        return {
          comments: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }

      const { comments, total } = result[0];

      return {
        comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('获取帖子评论错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取帖子评论失败', 500);
    }
  }
  // 获取社区统计数据
  async getCommunityStats() {
    try {
      // 获取一周前的日期
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // 直接传递 Date 对象，而不是转换为字符串
      const stats = await client.query(
        `
        with
          total_users := (select count(default::User)),
          total_posts := (select count(community::Post)),
          active_users_this_week := (
            select count(
              distinct community::Post.author.id
            )
              filter community::Post.created_at >= <datetime>$oneWeekAgo
          )
        select {
          total_users := total_users,
          total_posts := total_posts,
          active_users_this_week := active_users_this_week
        }
      `,
        { oneWeekAgo }
      );

      return stats[0];
    } catch (error) {
      console.error('获取社区统计数据错误:', error);
      throw new ApiError('获取社区统计数据失败', 500);
    }
  }
  async updatePost(params: UpdatePostParams) {
    const { postId, userId, title, content, tags, images } = params;

    try {
      // 检查帖子是否存在且属于当前用户
      const existingPost: Post[] = await client.query(
        `
      select community::Post {
        id,
        author: { id }
      }
      filter .id = <uuid>$postId
      limit 1
      `,
        { postId }
      );

      if (!existingPost.length) {
        throw new ApiError('帖子不存在', 404);
      }

      if (existingPost[0].author.id !== userId) {
        throw new ApiError('无权限修改此帖子', 403);
      }

      // 更新帖子
      const result = await client.query(
        `
      update community::Post
      filter .id = <uuid>$postId
      set {
        title := <str>$title,
        content := <str>$content,
        tags := <array<str>>$tags,
        ${images !== undefined ? 'images := <json>$images,' : ''}
        updated_at := datetime_current()
      }
      `,
        {
          postId,
          title,
          content,
          tags,
          ...(images !== undefined && { images: JSON.stringify(images) }),
        }
      );

      if (!result.length) {
        throw new ApiError('更新帖子失败', 500);
      }

      return result[0];
    } catch (error) {
      console.error('更新帖子错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('更新帖子失败', 500);
    }
  }
}

export const communityService = new CommunityService();
