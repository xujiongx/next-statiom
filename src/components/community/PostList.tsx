'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '../ui/badge';
import { communityApi } from '@/api/community';
import { Post } from '@/types/community';
import { useLikePost } from '@/hooks/useLikePost';
import Image from 'next/image';

interface PostListProps {
  sortBy?: 'latest' | 'popular' | 'following';
  filter?: string;
  tag?: string;
}

export default function PostList({
  sortBy = 'latest',
  filter,
  tag,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  console.log('👩‍💻', pagination);

  const { toast } = useToast();
  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        sortBy,
        page: pageNum,
        limit: 4,
        ...(tag && { tag }),
        ...(filter && { filter }),
      };

      const data = await communityApi.getPosts(params);
      if (pageNum === 1) {
        setPosts(data.data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.data.posts]);
      }
      setPagination({
        total: data.data.pagination.total,
        totalPages: data.data.pagination.totalPages,
      });
      setHasMore(pageNum < data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: '获取帖子失败',
        description: '请稍后再试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [sortBy, filter, tag]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const { handleLike } = useLikePost({ refresh: fetchPosts });

  // 在文章内容渲染部分添加图片渲染逻辑
  const renderPostContent = (post: Post) => {
    return (
      <div>
        {post.images && post.images.length > 0 && (
          <div className='grid grid-cols-3 gap-2 mt-4 mb-4'>
            {post.images.slice(0, 9).map((image, index) => (
              <div
                key={index}
                className='relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all'
              >
                <div className='relative w-full h-full'>
                  <Image
                    src={image.display_url || image.url}
                    alt={`图片 ${index + 1}`}
                    className='object-cover cursor-pointer transition-transform'
                    fill
                    sizes='(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw'
                    unoptimized={image.url.startsWith('blob:')}
                  />
                  {post.images.length > 9 && index === 8 && (
                    <div className='absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer'>
                      <span className='text-white text-lg font-medium'>
                        +{post.images.length - 9}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'
          >
            <Skeleton className='h-6 w-3/4 mb-4' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-2/3 mb-4' />
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <Skeleton className='h-8 w-8 rounded-full mr-2' />
                <Skeleton className='h-4 w-24' />
              </div>
              <div className='flex space-x-4'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-4 w-16' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center'>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          {tag ? `没有找到与 #${tag} 相关的帖子` : '暂无帖子'}
        </p>
        <Button className='mt-4'>
          <Link href='/community/new'>发布第一篇帖子</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {posts.map((post) => (
        <div
          key={post.id}
          className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all hover:shadow-md'
        >
          <Link
            href={`/subpackages/community/detail/${post.id}`}
            className='block'
          >
            <h3 className='text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400'>
              {post.title}
            </h3>
          </Link>
          <Link
            href={`/subpackages/community/detail/${post.id}`}
            className='block'
          >
            <p className='text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
              {post.content.replace(/<[^>]*>/g, '')}
            </p>
          </Link>

          <div className='flex flex-wrap gap-2 mb-4'>
            {post.tags &&
              post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='hover:bg-gray-200 dark:hover:bg-gray-700'
                >
                  <Link
                    href={`/subpackages/community/tag/${encodeURIComponent(
                      tag
                    )}`}
                  >
                    {tag}
                  </Link>
                </Badge>
              ))}
          </div>

          <Link
            href={`/subpackages/community/detail/${post.id}`}
            className='block'
          >
            {renderPostContent(post)}
          </Link>

          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <div className='flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white mr-2'>
                {post.author.nickname.charAt(0)}
              </div>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {post.author.nickname} ·
                {formatDistanceToNow(new Date(post.created_at), {
                  locale: zhCN,
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
              <div className='flex items-center'>
                <Eye className='h-4 w-4 mr-1' />
                <span>{post.view_count}</span>
              </div>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => handleLike(post.id)}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${
                    post.is_liked ? 'fill-current text-blue-500' : ''
                  }`}
                />
                <span>{post.like_count}</span>
              </div>
              <div className='flex items-center'>
                <MessageSquare className='h-4 w-4 mr-1' />
                <span>{post.comment_count}</span>
              </div>
            </div>
          </div>
          {post.new_comment && (
            <div className='mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-start'>
                <MessageSquare className='h-4 w-4 mr-2 text-gray-400 mt-1' />
                <div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                      {post.new_comment.author.nickname}
                    </span>
                    <span className='mx-1'>·</span>
                    <span className='text-xs'>
                      {formatDistanceToNow(
                        new Date(post.new_comment.created_at),
                        {
                          locale: zhCN,
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1'>
                    {post.new_comment.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {hasMore && (
        <div className='text-center pt-4'>
          <Button variant='outline' onClick={loadMore} disabled={loading}>
            {loading ? '加载中...' : '加载更多'}
          </Button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className='text-center pt-4 text-gray-500'>没有更多帖子了</div>
      )}
    </div>
  );
}
