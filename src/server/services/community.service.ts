import { UploadedImage } from '@/components/ui/image-upload';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ApiError } from '@/lib/error';
import { MyComment, Post } from '@/types/community';
import { Prisma } from '@prisma/client';

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

interface CreateCommentParams {
  postId: string;
  content: string;
  userId: string;
  parentId?: string;
}

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
  images?: UploadedImage[];
}

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: { select: { id: true; username: true; nickname: true } };
    _count: { select: { comments: true; likes: true } };
    comments: {
      include: {
        author: { select: { id: true; username: true; nickname: true } };
      };
    };
    likes: { select: { userId: true } };
  };
}>;

type CommentWithRelations = Prisma.CommentGetPayload<{
  include: {
    author: { select: { id: true; username: true; nickname: true } };
    parentComment: {
      include: {
        author: { select: { id: true; username: true; nickname: true } };
      };
    };
  };
}>;

function parseImages(images: unknown): UploadedImage[] {
  if (!images) return [];
  if (typeof images === 'string') {
    try {
      return JSON.parse(images) as UploadedImage[];
    } catch {
      return [];
    }
  }
  return images as UploadedImage[];
}

function mapAuthor(author: { id: string; username: string; nickname: string }) {
  return {
    id: author.id,
    nickname: author.nickname,
    image: '',
  };
}

function mapComment(comment: CommentWithRelations): MyComment {
  return {
    id: comment.id,
    content: comment.content,
    created_at: comment.createdAt.toISOString(),
    author: mapAuthor(comment.author),
    parent_comment: comment.parentComment
      ? {
          id: comment.parentComment.id,
          content: comment.parentComment.content,
          created_at: comment.parentComment.createdAt.toISOString(),
          author: mapAuthor(comment.parentComment.author),
        }
      : undefined,
  };
}

function mapPostListItem(post: PostWithRelations, userId?: string) {
  const latestComment = post.comments[0];

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    tags: post.tags,
    images: parseImages(post.images),
    created_at: post.createdAt.toISOString(),
    view_count: post.viewCount,
    author: mapAuthor(post.author),
    comment_count: post._count.comments,
    like_count: post._count.likes,
    is_liked: userId ? post.likes.some((like) => like.userId === userId) : false,
    new_comment: latestComment ? mapComment(latestComment as CommentWithRelations) : undefined,
    comments: [],
    likes: [],
  };
}

export class CommunityService {
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
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new ApiError('用户不存在', 404);
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          tags,
          images: images as unknown as Prisma.InputJsonValue,
          authorId: userId,
        },
        include: {
          author: {
            select: { id: true, username: true, nickname: true },
          },
        },
      });

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        created_at: post.createdAt.toISOString(),
        author: post.author,
      };
    } catch (error) {
      console.error('创建帖子错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ApiError('用户不存在或ID格式错误', 400);
        }
      }
      throw new ApiError('创建帖子失败', 500);
    }
  }

  async getPosts(filter: PostFilter = {}) {
    const {
      tag,
      authorId,
      page = 1,
      limit = 10,
      sortBy = 'latest',
      userId,
    } = filter;

    const offset = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};
    if (tag) {
      where.tags = { has: tag };
    }
    if (authorId) {
      where.authorId = authorId;
    }
    if (sortBy === 'following' && userId) {
      where.likes = { some: { userId } };
    }

    const include = {
      author: { select: { id: true, username: true, nickname: true } },
      _count: { select: { comments: true, likes: true } },
      comments: {
        take: 1,
        orderBy: { createdAt: 'desc' as const },
        include: {
          author: { select: { id: true, username: true, nickname: true } },
        },
      },
      likes: {
        select: { userId: true },
      },
    };

    try {
      let posts: PostWithRelations[];

      if (sortBy === 'popular') {
        const allPosts = await prisma.post.findMany({ where, include });
        allPosts.sort((a, b) => {
          const scoreA = a._count.likes * 2 + a._count.comments * 3 + a.viewCount;
          const scoreB = b._count.likes * 2 + b._count.comments * 3 + b.viewCount;
          return (
            scoreB - scoreA ||
            b.createdAt.getTime() - a.createdAt.getTime()
          );
        });
        posts = allPosts.slice(offset, offset + limit);
      } else {
        posts = await prisma.post.findMany({
          where,
          include,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        });
      }

      const total = await prisma.post.count({ where });

      return {
        posts: posts.map((post) => mapPostListItem(post, userId)),
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

  async getPostById(postId: string) {
    const session = await getServerSession();
    const userId = session?.user?.id;

    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: { select: { id: true, username: true, nickname: true } },
          comments: {
            orderBy: { createdAt: 'desc' },
            include: {
              author: { select: { id: true, username: true, nickname: true } },
              parentComment: {
                include: {
                  author: { select: { id: true, username: true, nickname: true } },
                },
              },
            },
          },
          likes: { select: { userId: true } },
          _count: { select: { likes: true } },
        },
      });

      if (!post) {
        throw new ApiError('帖子不存在', 404);
      }

      await prisma.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
      });

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        images: parseImages(post.images),
        created_at: post.createdAt.toISOString(),
        updated_at: post.updatedAt?.toISOString(),
        view_count: post.viewCount + 1,
        author: mapAuthor(post.author),
        comments: post.comments.map((comment) => mapComment(comment)),
        likes: post.likes,
        like_count: post._count.likes,
        is_liked: userId ? post.likes.some((like) => like.userId === userId) : false,
        comment_count: post.comments.length,
        new_comment: post.comments[0]
          ? mapComment(post.comments[0])
          : undefined,
      } as Post;
    } catch (error) {
      console.error('获取帖子详情错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('获取帖子详情失败', 500);
    }
  }

  async createComment(params: CreateCommentParams) {
    const { postId, content, userId, parentId } = params;

    if (!content.trim()) {
      throw new ApiError('评论内容不能为空', 400);
    }

    try {
      const [user, post] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
        prisma.post.findUnique({ where: { id: postId }, select: { id: true } }),
      ]);

      if (!user || !post) {
        throw new ApiError('用户或帖子不存在', 400);
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
          parentCommentId: parentId,
        },
        include: {
          author: { select: { id: true, username: true, nickname: true } },
          parentComment: {
            include: {
              author: { select: { id: true, username: true, nickname: true } },
            },
          },
        },
      });

      return mapComment(comment);
    } catch (error) {
      console.error('添加评论错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ApiError('用户或帖子不存在', 400);
      }
      throw new ApiError('添加评论失败', 500);
    }
  }

  async toggleLike(params: LikeParams) {
    const { postId, userId } = params;

    try {
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: { postId, userId },
        },
      });

      if (existingLike) {
        await prisma.postLike.delete({
          where: {
            postId_userId: { postId, userId },
          },
        });
        return { liked: false };
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      });

      if (!post) {
        throw new ApiError('帖子不存在', 404);
      }

      await prisma.postLike.create({
        data: { postId, userId },
      });

      return { liked: true };
    } catch (error) {
      console.error('点赞操作错误:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ApiError('用户或帖子不存在', 400);
      }
      throw new ApiError('操作失败', 500);
    }
  }

  async getPopularTags(limit: number = 10) {
    try {
      const posts = await prisma.post.findMany({
        select: { tags: true },
      });

      const tagCounts = new Map<string, number>();
      for (const post of posts) {
        for (const tag of post.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }

      return Array.from(tagCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('获取热门标签错误:', error);
      throw new ApiError('获取热门标签失败', 500);
    }
  }

  async getPostComments(postId: string, page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: { postId } }),
        prisma.comment.findMany({
          where: { postId },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            author: { select: { id: true, username: true, nickname: true } },
            parentComment: {
              include: {
                author: { select: { id: true, username: true, nickname: true } },
              },
            },
          },
        }),
      ]);

      return {
        comments: comments.map((comment) => mapComment(comment)),
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

  async getCommunityStats() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [totalUsers, totalPosts, activeUsersThisWeek] = await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.post.findMany({
          where: { createdAt: { gte: oneWeekAgo } },
          select: { authorId: true },
          distinct: ['authorId'],
        }),
      ]);

      return {
        total_users: totalUsers,
        total_posts: totalPosts,
        active_users_this_week: activeUsersThisWeek.length,
      };
    } catch (error) {
      console.error('获取社区统计数据错误:', error);
      throw new ApiError('获取社区统计数据失败', 500);
    }
  }

  async updatePost(params: UpdatePostParams) {
    const { postId, userId, title, content, tags, images } = params;

    try {
      const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true, authorId: true },
      });

      if (!existingPost) {
        throw new ApiError('帖子不存在', 404);
      }

      if (existingPost.authorId !== userId) {
        throw new ApiError('无权限修改此帖子', 403);
      }

      const result = await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          content,
          tags,
          ...(images !== undefined && {
            images: images as unknown as Prisma.InputJsonValue,
          }),
          updatedAt: new Date(),
        },
      });

      return result;
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
