'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { communityApi } from '@/api/community';
import { PostForm } from '../components/PostForm';

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (values: { title: string; content: string; tags: string[] }) => {
    try {
      const response = await communityApi.createPost(values);
      console.log('🦹‍♀️', response);
      
      toast({
        title: '发布成功',
        description: '您的帖子已成功发布',
      });
      
      router.push('/community');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: '发布失败',
        description: '请稍后再试',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">发布新帖子</h1>
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}