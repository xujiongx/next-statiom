import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Reply, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { MyComment } from '@/types/community';
import { useToast } from '@/components/ui/use-toast';
import { communityApi } from '@/api/community';

interface CommentsListProps {
  comments: MyComment[];
  loading: boolean;
  onReply: (comment: MyComment) => void;
  onCommentDeleted?: () => void;
  currentUserId?: string;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function CommentsList({ 
  comments, 
  loading, 
  onReply, 
  onCommentDeleted,
  currentUserId,
  total,
  page,
  onPageChange
}: CommentsListProps) {
  const { toast } = useToast();

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    
    try {
      await communityApi.deleteComment(commentId);
      toast({
        title: '删除成功',
        description: '评论已被删除',
      });
      if (onCommentDeleted) {
        onCommentDeleted();
      }
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
      <div className='space-y-4'>
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-20 w-full' />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        暂无评论，来发表第一条评论吧！
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment: MyComment, index: number) => (
        <Card key={comment.id} className='w-full'>
          <CardHeader className='pb-2'>
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarFallback>
                  {comment.author.nickname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='font-medium'>
                      {comment.author.nickname}
                    </span>
                    <span className='text-xs text-muted-foreground ml-2'>
                      #{comments.length - index}楼
                    </span>
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {formatDistanceToNow(new Date(comment.created_at), {
                      locale: zhCN,
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {comment.parent_comment && (
              <div className='bg-muted p-3 rounded-md mb-2 text-sm'>
                <span className='text-muted-foreground'>
                  回复 @{comment.parent_comment.author.nickname}：
                  {comment.parent_comment.content}
                </span>
              </div>
            )}
            <p className='text-gray-700 dark:text-gray-300'>
              {comment.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground'
              onClick={() => onReply(comment)}
            >
              <Reply className='h-4 w-4 mr-1' />
              回复
            </Button>
            
            {currentUserId && currentUserId === comment.author.id && (
              <Button
                variant='ghost'
                size='sm'
                className='text-red-500 hover:text-red-700 hover:bg-red-50'
                onClick={() => handleDelete(comment.id)}
              >
                <Trash className='h-4 w-4 mr-1' />
                删除
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      {total > 10 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {page} 页 / 共 {Math.ceil(total / 10)} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= Math.ceil(total / 10) || loading}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}