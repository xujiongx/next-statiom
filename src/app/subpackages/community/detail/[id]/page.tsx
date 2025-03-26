'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MyComment } from '@/types/community';
import { usePostDetail } from '@/hooks/usePostDetail';
import { PostDetail } from '../components/PostDetail';
import { CommentsList } from '../components/CommentsList';
import { CommentForm } from '../components/CommentForm';
import { useLikePost } from '@/hooks/useLikePost';

import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { communityApi } from '@/api/community';
import { PostActions } from '../components/PostActions';
import { useAuth } from '@/hooks/useAuth';

function PostDetailContent() {
  const [page, setPage] = useState(1);
  const params = useParams();
  const postId = params.id as string;
  const {
    post,
    loading,
    fetchPost,
    comments,
    loadingComments,
    fetchComments,
    total, // 添加 total
  } = usePostDetail(postId);
  const [replyTo, setReplyTo] = useState<{
    id: string;
    nickname: string;
  } | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { user } = useAuth();
  const handleReply = (comment: MyComment) => {
    setReplyTo({
      id: comment.id,
      nickname: comment.author.nickname,
    });
    setShowCommentForm(true);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleCommentSubmitted = () => {
    fetchComments();
    setReplyTo(null);
  };

  const { handleLike } = useLikePost({ refresh: fetchPost });

  const router = useRouter();

  const handleEdit = () => {
    router.replace(`/subpackages/community/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这篇帖子吗？')) return;
    try {
      await communityApi.deletePost(postId);
      toast({
        title: '删除成功',
        description: '帖子已被删除',
      });
      router.push('/community');
    } catch {
      toast({
        title: '删除失败',
        description: '请稍后再试',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6'>
          <Skeleton className='h-8 w-3/4' />
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-4 w-32' />
          </div>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center'>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            文章不存在或已被删除
          </p>
        </div>
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchComments(newPage);
  };

  return (
    <div className='container mx-auto relative'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
        <PostDetail post={post} handleLike={handleLike} />

        {user?.id === post.author.id && (
          <div className='fixed top-1/2 right-4 md:right-[calc((100%-896px)/2-48px)]'>
            <PostActions
              postId={postId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        <div className='mt-8 border-t dark:border-gray-700 pt-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              评论 ({total || 0}) {/* 修改这里显示总评论数 */}
            </h2>
            <Button
              variant='outline'
              onClick={() => setShowCommentForm(true)}
              className='hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <MessageSquare className='h-4 w-4 mr-2' />
              发表评论
            </Button>
          </div>

          <div className='space-y-6'>
            <CommentsList
              comments={comments}
              loading={loadingComments}
              onReply={handleReply}
              onCommentDeleted={() => fetchComments(page)}
              currentUserId={user?.id}
              total={total || 0}
              page={page}
              onPageChange={handlePageChange}
            />
          </div>

          <CommentForm
            postId={postId}
            replyTo={replyTo}
            onCancelReply={handleCancelReply}
            onCommentSubmitted={handleCommentSubmitted}
            user={user}
            showComments={showCommentForm}
            setShowComments={setShowCommentForm}
          />
        </div>
      </div>
    </div>
  );
}

export default PostDetailContent;
