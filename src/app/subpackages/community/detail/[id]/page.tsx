'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { communityApi, Post } from '@/api/community';

export default function PostDetail() {
  const params = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await communityApi.getPostById(params.id as string);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: '获取文章详情失败',
          description: '请稍后再试',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className='space-y-4 p-6'>
        <Skeleton className='h-8 w-3/4' />
        <div className='flex items-center space-x-4 my-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <Skeleton className='h-4 w-32' />
        </div>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>
    );
  }

  if (!post) {
    return (
      <div className='text-center p-6'>
        <p className='text-lg text-gray-600'>文章不存在或已被删除</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl p-6'>
      <h1 className='text-3xl font-bold mb-4'>{post.title}</h1>

      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center'>
            <span className='text-gray-600'>{post.author.nickname}</span>
            <span className='mx-2'>·</span>
            <span className='text-gray-500'>
              {formatDistanceToNow(new Date(post.created_at), {
                locale: zhCN,
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-4 text-gray-500'>
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

      {post.tags && post.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-6'>
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant='secondary'>
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className='prose dark:prose-invert max-w-none'>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
