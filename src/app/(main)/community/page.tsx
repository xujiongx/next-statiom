import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityHeader from '@/components/community/CommunityHeader'
import PostList from '@/components/community/PostList'
import TagCloud from '@/components/community/TagCloud'
import Loading from '../../subpackages/chat/loading'


export const metadata = {
  title: "社区 | AI分身",
  description: "加入我们的社区，分享和发现AI工具的创新用法",
};

export default function CommunityPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <CommunityHeader />

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mt-8'>
        <div className='md:col-span-3'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>社区讨论</h2>
            <Button asChild>
              <Link href='/subpackages/community/new'>发布帖子</Link>
            </Button>
          </div>

          <Tabs defaultValue='latest' className='mb-6'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='latest'>最新</TabsTrigger>
              <TabsTrigger value='popular'>热门</TabsTrigger>
              <TabsTrigger value='following'>关注</TabsTrigger>
            </TabsList>
            <TabsContent value='latest'>
              <Suspense fallback={<Loading />}>
                <PostList sortBy='latest' />
              </Suspense>
            </TabsContent>
            <TabsContent value='popular'>
              <Suspense fallback={<Loading />}>
                <PostList sortBy='popular' />
              </Suspense>
            </TabsContent>
            <TabsContent value='following'>
              <Suspense fallback={<Loading />}>
                <PostList sortBy='following' />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>

        <div className='space-y-6'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h3 className='text-lg font-medium mb-4'>热门标签</h3>
            <Suspense fallback={<Loading />}>
              <TagCloud />
            </Suspense>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h3 className='text-lg font-medium mb-4'>社区指南</h3>
            <ul className='space-y-2 text-sm'>
              <li>尊重他人，保持友善</li>
              <li>分享有价值的内容</li>
              <li>遵守社区规则</li>
              <li>帮助新成员融入社区</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}