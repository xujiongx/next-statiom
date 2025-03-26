import { toast } from '@/components/ui/use-toast';
import { communityApi } from '@/api/community';

interface Props {
  refresh: () => void;
}

export function useLikePost(props: Props) {
  const { refresh } = props;
  const handleLike = async (postId: string) => {
    try {
      await communityApi.toggleLike(postId);
      refresh();

      toast({
        title: '操作成功',
        variant: 'default',
      });
    } catch (error) {
      console.error('点赞失败:', error);
      toast({
        title: '点赞失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  return {
    handleLike,
  };
}
