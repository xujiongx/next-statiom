'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
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
              {loading ? '提交中...' : form.watch('isRegister') ? '注册' : '登录'}
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
        </Form>
      </div>
    </div>
  );
}
