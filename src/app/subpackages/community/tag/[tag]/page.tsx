import { Metadata } from 'next';
import PostList from '@/components/community/PostList';
import { Badge } from '@/components/ui/badge';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);
  return {
    title: `${decodedTag} - 标签 - 社区`,
    description: `查看所有带有 ${decodedTag} 标签的帖子`,
  };
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);

  return (
    <div className='container max-w-4xl py-6'>
      <div className='m-6'>
        <h1 className='text-2xl font-bold mb-2'>
          标签：
          <Badge variant='outline' className='ml-2 text-lg'>
            {decodedTag}
          </Badge>
        </h1>
        <p className='text-muted-foreground'>
          显示所有带有 {decodedTag} 标签的帖子
        </p>
      </div>

      <PostList tag={decodedTag} />
    </div>
  );
}
