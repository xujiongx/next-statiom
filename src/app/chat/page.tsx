'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { chatApi, ChatMessage } from '@/api/chat';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { History, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

function ChatContent() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      try {
        setInitialLoading(true);
        if (id) {
          setSessionId(id);
          await loadHistoryMessages(id);
        } else {
          await loadLatestConversation();
        }
      } catch {
        toast({
          variant: 'destructive',
          title: '初始化失败',
          description: '加载对话失败，请刷新重试',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    initChat();
  }, [id]);

  const loadLatestConversation = async () => {
    try {
      setLoading(true);
      const res = await chatApi.getLatestConversation();

      if (res.code === 0 && res.data) {
        setSessionId(res.data.session_id);
        loadHistoryMessages(res.data.session_id);
      } else {
        // 没有历史对话，创建新会话
        setSessionId(Date.now().toString());
      }
    } catch {
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: '获取最近对话失败',
      });
      setSessionId(Date.now().toString());
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryMessages = async (sessionId: string) => {
    try {
      setLoading(true);
      const res = await chatApi.getHistory(sessionId);

      if (res.code === 0 && res.data?.messages) {
        setMessages(res.data.messages);
      } else {
        toast({
          variant: 'destructive',
          title: '加载失败',
          description: res.message || '获取历史记录失败',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: '网络错误，请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.sendMessage({
        content: userMessage.content,
        sessionId,
      });

      if (res.code === 0 && res.data) {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          content: res.data,
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast({
          variant: 'destructive',
          title: '发送失败',
          description: res.message || '请稍后重试',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: '发送失败',
        description: '网络错误，请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]); // 清空消息列表
    setSessionId(Date.now().toString()); // 生成新的会话 ID
    router.push('/chat');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 消息列表变化时滚动到底部

  return (
    <div className='flex flex-col h-[100vh]'>
      <div className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center gap-4'>
          <h1 className='text-lg font-medium'>AI 助手</h1>
          <Button variant='outline' size='sm' onClick={handleNewChat}>
            新对话
          </Button>
        </div>
        <Button variant='ghost' size='icon' asChild>
          <Link href='/chat/history'>
            <History className='h-5 w-5' />
          </Link>
        </Button>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {initialLoading ? (
          <div className='h-full flex flex-col items-center justify-center text-gray-500'>
            <p className='text-lg mb-2'>加载中...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-gray-500'>
            <p className='text-lg mb-2'>开始一个新的对话</p>
            <p className='text-sm'>你可以问我任何问题</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        {loading && (
          <div className='flex justify-start'>
            <div className='bg-gray-100 rounded-lg p-3'>正在思考...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className='p-4 border-t'>
        <div className='flex gap-2'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='输入消息...'
            disabled={loading || initialLoading}
          />
          <Button
            type='submit'
            disabled={loading || initialLoading || !input.trim()}
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </form>
    </div>
  );
}
