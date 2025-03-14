'use client';

import { useEffect, useState } from 'react';
import { Message, messageApi } from '@/api/message';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagePage() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;

    const fetchConversations = async () => {
      try {
        const res = await messageApi.getMessages();
        if (!isSubscribed) return;

        if (res.code === 0) {
          setConversations(res.data);
        } else {
          toast({
            variant: 'destructive',
            title: '获取消息列表失败',
            description: res.message,
          });
        }
      } catch {
        if (!isSubscribed) return;
        toast({
          variant: 'destructive',
          title: '错误',
          description: '获取消息列表失败，请稍后重试',
        });
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchConversations();

    return () => {
      isSubscribed = false;
    };
  }, [toast]);

  return (
    <div className='p-4 space-y-4'>
      {loading ? (
        <div className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className='h-20 w-full' />
          ))}
        </div>
      ) : conversations.length > 0 ? (
        <div className='space-y-3'>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className='p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'
            >
              <h3 className='font-medium'>{conversation.title}</h3>
              <p className='text-sm text-gray-500 mt-2'>
                更新时间：
                {format(
                  new Date(conversation.updated_at),
                  'yyyy-MM-dd HH:mm:ss'
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center text-gray-500 py-8'>暂无消息记录</div>
      )}
    </div>
  );
}
