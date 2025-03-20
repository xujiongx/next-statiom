'use client';

import { useEffect, useState } from 'react';
import { chatApi } from '@/api/chat';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Conversation {
  id: string;
  session_id: string;
  title: string;
  updated_at: string;
}

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await chatApi.getConversations();
      if (res.code === 0) {
        setConversations(res.data.conversations);
      } else {
        toast({
          variant: 'destructive',
          title: '获取历史记录失败',
          description: res.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '获取历史记录失败，请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (session_id: string) => {
    try {
      const res = await chatApi.deleteConversation(session_id);
      if (res.code === 0) {
        setConversations((prev) =>
          prev.filter((conv) => conv.session_id !== session_id)
        );
        toast({
          title: '删除成功',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: '删除失败',
        description: '请稍后重试',
      });
    }
  };

  return (
    <div className='flex flex-col h-[100vh]'>
      <div className='flex items-center gap-2 p-4 border-b'>
        <Button variant='ghost' size='icon' asChild>
          <Link href='/subpackages/chat'>
            <ArrowLeft className='h-5 w-5' />
          </Link>
        </Button>
        <h1 className='text-lg font-medium'>历史记录</h1>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
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
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
              >
                <Link
                  href={`/subpackages/chat?id=${conversation.session_id}`}
                  className='flex-1'
                >
                  <h3 className='font-medium line-clamp-1'>
                    {conversation.title}
                  </h3>
                  <p className='text-sm text-gray-500 mt-1'>
                    {format(
                      new Date(conversation.updated_at),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </p>
                </Link>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(conversation.session_id);
                  }}
                >
                  <Trash2 className='h-4 w-4 text-gray-500' />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-500 py-8'>暂无历史记录</div>
        )}
      </div>
    </div>
  );
}
