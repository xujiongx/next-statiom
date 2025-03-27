'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { WechatIcon } from '@/components/icons/WechatIcon';

const formSchema = z.object({
  username: z.string().min(1, '请输入用户名').trim(),
  password: z.string().min(6, '密码至少6位').max(20, '密码最多20位'),
  nickname: z.string().min(1, '请输入昵称').optional(),
  isRegister: z.boolean().default(false),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) return;

    try {
      setLoading(true);
      const api = values.isRegister ? authApi.register : authApi.login;
      const res = await api(values);

      if (res?.code === 0 && res.data) {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.user));

        toast({
          title: values.isRegister ? '注册成功' : '登录成功',
          description: '正在跳转...',
          className: 'bg-green-500 text-white',
        });

        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } else {
        toast({
          variant: 'destructive',
          title: '登录失败',
          description: res?.message || '未知错误',
        });
        // 清除可能存在的旧数据
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userInfo');
      }
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        description: (error as Error).message || '网络错误，请稍后重试',
        title: '错误',
      });
      // 清除可能存在的旧数据
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatLogin = () => {
    // 获取微信登录二维码URL
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/wechat/callback`);
    const appId = process.env.NEXT_PUBLIC_WECHAT_APP_ID;
    const wechatUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${Math.random().toString(36).slice(2)}#wechat_redirect`;
    
    window.open(wechatUrl, 'wechat_login', 'width=800,height=600');
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOGIN_SUCCESS') {
        // 登录成功，更新状态
        sessionStorage.setItem('token', event.data.data.token);
        sessionStorage.setItem('userInfo', JSON.stringify(event.data.data.user));
        router.replace('/');
      } else if (event.data.type === 'LOGIN_ERROR') {
        // 登录失败，显示错误信息
        toast({
          variant: 'destructive',
          title: '登录失败',
          description: event.data.error,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router, toast]);

  return (
    <div className='min-h-screen bg-background p-4 flex flex-col'>
      <div className='max-w-md w-full mx-auto'>
        <h1 className='text-2xl font-bold text-center my-8'>
          {form.watch('isRegister') ? '注册' : '登录'}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入用户名' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='请输入密码'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('isRegister') && (
              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>昵称</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入昵称' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type='submit'
              className='w-full'
              disabled={loading || !form.formState.isValid}
            >
              {loading
                ? '提交中...'
                : form.watch('isRegister')
                ? '注册'
                : '登录'}
            </Button>

            <div className='text-center'>
              <Button
                type='button'
                variant='link'
                onClick={() =>
                  form.setValue('isRegister', !form.watch('isRegister'))
                }
              >
                {form.watch('isRegister')
                  ? '已有账号？去登录'
                  : '没有账号？去注册'}
              </Button>
            </div>
          </form>
          <div className='mt-6 text-center'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-background text-muted-foreground'>
                  或使用以下方式登录
                </span>
              </div>
            </div>

            <div className='mt-6'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleWechatLogin}
              >
                <WechatIcon className='w-5 h-5 mr-2' />
                微信登录
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
