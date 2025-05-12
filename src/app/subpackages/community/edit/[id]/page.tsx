'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { communityApi } from '@/api/community';
import { PostForm } from '../../components/PostForm';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/types/community';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await communityApi.getPostById(postId);
        setPost(response.data);
      } catch {
        toast({
          title: '获取帖子失败',
          description: '请稍后再试',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (values: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    try {
      await communityApi.updatePost(postId, values);
      toast({
        title: '更新成功',
        description: '帖子已更新',
      });
      router.replace(`/subpackages/community/detail/${postId}`);
    } catch {
      toast({
        title: '更新失败',
        description: '请稍后再试',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className='container max-w-4xl mx-auto p-6'>
        <Skeleton className='h-8 w-32 mb-6' />
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='container max-w-4xl mx-auto p-6'>
        <div className='text-center'>
          <p className='text-lg text-muted-foreground'>帖子不存在或已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>编辑帖子</h1>
      <PostForm
        initialValues={{
          title: post.title,
          content: post.content,
          tags: post.tags,
          images: post.images,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
