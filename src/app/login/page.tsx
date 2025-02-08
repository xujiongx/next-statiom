'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import { Message } from '@/components/common/Message';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    content: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    try {
      setLoading(true);
      console.log('👨‍🎨', 22);
      const res = await login(values);

      console.log('👨‍🎨', res);

      if (res?.code === 0 && res.data) {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.user));
        setMessage({ type: 'success', content: '登录成功' });

        // 直接延迟路由跳转
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } else {
        setMessage({
          type: 'error',
          content: res?.message || '登录失败',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        content: error.message || '网络错误，请稍后重试',
      });
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white p-4 flex flex-col'>
      <h1 className='text-2xl font-bold text-center my-8'>登录</h1>

      {message && (
        <Message
          type={message.type}
          content={message.content}
          onClose={() => setMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>用户名</label>
          <input
            type='text'
            name='username'
            required
            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='请输入用户名'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>密码</label>
          <input
            type='password'
            name='password'
            required
            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='请输入密码'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium
            ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }`}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
