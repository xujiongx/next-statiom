'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authApi, UserInfo } from '@/api/auth';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function MePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    let isSubscribed = true;

    const fetchUserInfo = async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (!isSubscribed) return;

        if (res.code === 0 && res.data) {
          setUserInfo(res.data);
          sessionStorage.setItem('userInfo', JSON.stringify(res.data));
        } else {
          toast({
            variant: 'destructive',
            title: '获取用户信息失败',
            description: res.message || '请重新登录',
          });
          router.replace('/login');
        }
      } catch {
        if (!isSubscribed) return;

        toast({
          variant: 'destructive',
          title: '获取用户信息失败',
          description: '网络错误，请稍后重试',
        });
        router.replace('/login');
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();

    return () => {
      isSubscribed = false;
    };
  }, [router, toast]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (loading) return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-muted-foreground">加载中...</div>
    </div>
  );

  if (!userInfo) return null;

  return (
    <div className='p-4 space-y-6'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4'>
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center'>
            <span className='text-2xl'>
              {userInfo.nickname?.[0] || userInfo.username[0]}
            </span>
          </div>
          <div>
            <h2 className='text-lg font-medium dark:text-white'>
              {userInfo.nickname || userInfo.username}
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>ID: {userInfo.id}</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="ml-auto p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="切换主题"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className='border-t dark:border-gray-700 pt-4'>
          <button
            onClick={handleLogout}
            className='w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700'
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
