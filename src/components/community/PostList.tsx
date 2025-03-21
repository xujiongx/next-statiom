'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '../ui/badge';
import { communityApi } from '@/api/community';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  tags: string[];
  author: {
    id: string;
    nickname: string;
    image: string;
  };
  comments: unknown[];
  likes: unknown[];
}

interface PostListProps {
  sortBy?: string;
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

  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {
          sortBy,
          ...(tag && { tag }),
          ...(filter && { filter }),
        };

        const data = await communityApi.getPosts(params);
        setPosts(data.data.posts);
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

    fetchPosts();
  }, [sortBy, filter, tag, toast]);

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
          <Link href={`/subpackages/community/detail/${post.id}`} className='block'>
            <h3 className='text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400'>
              {post.title}
            </h3>
          </Link>

          <p className='text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
            {post.content.replace(/<[^>]*>/g, '')}
          </p>

          <div className='flex flex-wrap gap-2 mb-4'>
            {post.tags &&
              post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='hover:bg-gray-200 dark:hover:bg-gray-700'
                >
                  <Link href={`/community/tag/${encodeURIComponent(tag)}`}>
                    {tag}
                  </Link>
                </Badge>
              ))}
          </div>

          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              {/* <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div> */}
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
              <div className='flex items-center'>
                <Heart className='h-4 w-4 mr-1' />
                <span>{post.likes?.length}</span>
              </div>
              <div className='flex items-center'>
                <MessageSquare className='h-4 w-4 mr-1' />
                <span>{post.comments?.length}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
