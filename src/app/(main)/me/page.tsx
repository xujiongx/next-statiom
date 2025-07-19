'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authApi, UserInfo } from '@/api/auth';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from 'next-themes';
import { Moon, Sun, MessageSquare, LogOut, ChevronRight, Calendar, Star } from 'lucide-react';

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

  if (loading)
    return (
      <div className='h-[calc(100vh-4rem)] flex items-center justify-center'>
        <div className='text-muted-foreground'>加载中...</div>
      </div>
    );

  if (!userInfo) return null;

  // 功能列表项
  const menuItems = [
    {
      icon: MessageSquare,
      label: "我的对话",
      onClick: () => router.push("/subpackages/chat/history"),
    },
    {
      icon: Calendar,
      label: "我的任务",
      onClick: () => router.push("/subpackages/tasks"),
    },
    {
      icon: Star,
      label: "我的常用",
      onClick: () => router.push("/subpackages/favorites"),
    },
  ];

  return (
    <div className='p-4 md:p-6 space-y-6 max-w-2xl mx-auto'>
      {/* 用户信息卡片 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
        {/* 顶部背景装饰 */}
        <div className='h-28 relative overflow-hidden'>
          {/* 渐变背景 */}
          <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'></div>

          {/* 动态光效 */}
          <div className='absolute inset-0 opacity-30'>
            <div className='absolute inset-0 animate-[lightFlow_6s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
          </div>

          {/* 点状图案背景 */}
          <div className='absolute inset-0 opacity-15'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0.5px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            ></div>
          </div>

          {/* 波浪装饰 */}
          <div className='absolute top-0 left-0 right-0 h-16 w-full z-10'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
              className='absolute top-0 w-full h-full'
            >
              <path
                d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
                opacity='.25'
                fill='currentColor'
                className='text-white/30 dark:text-gray-800/40'
              ></path>
              <path
                d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
                opacity='.35'
                fill='currentColor'
                className='text-white/40 dark:text-gray-800/50'
              ></path>
            </svg>
          </div>
        </div>

        {/* 用户信息 */}
        <div className='px-6 pb-6 -mt-14'>
          <div className='flex items-end mb-4'>
            <div className='relative'>
              {/* 优化后的头像光晕 */}
              <div className='absolute -inset-1 bg-gradient-to-tr from-blue-400/60 via-purple-500/50 to-pink-400/40 rounded-full opacity-80 blur-lg animate-pulse'></div>
              <div className='w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-800 rounded-full border-4 border-white/80 dark:border-gray-800 flex items-center justify-center shadow-lg relative z-10 transition-transform hover:scale-105'>
                <span className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300'>
                  {userInfo.nickname?.[0] || userInfo.username[0]}
                </span>
              </div>
            </div>
            {/* 优化后的主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className='ml-auto p-3 rounded-full bg-white/90 dark:bg-gray-700/80 hover:bg-gray-100/80 dark:hover:bg-gray-600/90 backdrop-blur-sm shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5'
              aria-label='切换主题'
            >
              {theme === 'dark' ? (
                <Sun className='h-6 w-6 text-amber-400' />
              ) : (
                <Moon className='h-6 w-6 text-slate-600 dark:text-slate-300' />
              )}
            </button>
          </div>

          {/* 用户信息文字优化 */}
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300'>
              {userInfo.nickname || userInfo.username}
            </h2>
            <p className='text-sm font-mono text-gray-500/90 dark:text-gray-400/80 bg-gray-100/50 dark:bg-gray-700/30 px-3 py-1 rounded-md inline-block'>
              ID: {userInfo.id}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
        <ul className='divide-y divide-gray-100 dark:divide-gray-700'>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className='w-full py-4 px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
              >
                <div className='flex items-center space-x-3'>
                  <item.icon className='h-5 w-5 text-primary/80' />
                  <span className='font-medium'>{item.label}</span>
                </div>
                <ChevronRight className='h-4 w-4 text-gray-400' />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 退出登录按钮 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
        <button
          onClick={handleLogout}
          className='w-full py-4 px-6 flex items-center space-x-3 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
        >
          <LogOut className='h-5 w-5' />
          <span className='font-medium'>退出登录</span>
        </button>
      </div>
    </div>
  );
}
