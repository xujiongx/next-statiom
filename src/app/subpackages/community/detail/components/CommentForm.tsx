import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { communityApi } from '@/api/community';
import { toast } from '@/components/ui/use-toast';
import { UserInfo } from '@/api/auth'

interface CommentFormProps {
  postId: string;
  replyTo: { id: string; nickname: string } | null;
  onCancelReply: () => void;
  onCommentSubmitted: () => void;
  user: UserInfo | null;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
}

export function CommentForm({
  postId,
  replyTo,
  onCancelReply,
  onCommentSubmitted,
  user,
  showComments,
  setShowComments,
}: CommentFormProps) {
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (replyTo) {
      setCommentContent(`@${replyTo.nickname} `);
      setShowComments(true);
    } else {
      setCommentContent('');
    }
  }, [replyTo, setShowComments]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      toast({
        title: '评论内容不能为空',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: '请先登录',
        description: '登录后即可发表评论',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await communityApi.addComment(postId, commentContent, replyTo?.id);

      setCommentContent('');
      toast({
        title: '评论发表成功',
        variant: 'default',
      });
      onCommentSubmitted();
      setShowComments(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: '评论发表失败',
        description: '请稍后再试',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog modal={false} open={showComments} onOpenChange={setShowComments}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {replyTo ? `回复 @${replyTo.nickname}` : '发表评论'}
          </DialogTitle>
        </DialogHeader>

        {replyTo && (
          <div className='flex items-center justify-between text-sm text-muted-foreground mb-2'>
            <Button variant='ghost' size='sm' onClick={onCancelReply}>
              取消回复
            </Button>
          </div>
        )}

        <Textarea
          placeholder='写下你的评论...'
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className='min-h-[100px]'
        />

        <div className='flex justify-end'>
          <Button
            onClick={handleSubmitComment}
            disabled={submitting || !commentContent.trim()}
            className='flex items-center'
          >
            <Send className='h-4 w-4 mr-2' />
            {submitting ? '发送中...' : '发表评论'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
