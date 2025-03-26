import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/community';

interface PostDetailProps {
  post: Post;
  handleLike: (postId: string) => void;
}

export function PostDetail({ post, handleLike }: PostDetailProps) {
  return (
    <article className="w-full">
      <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100'>{post.title}</h1>
      
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center text-sm'>
            <span className='text-gray-700 dark:text-gray-300 font-medium'>{post.author.nickname}</span>
            <span className='mx-2 text-gray-400'>·</span>
            <span className='text-gray-500 dark:text-gray-400'>
              {formatDistanceToNow(new Date(post.created_at), {
                locale: zhCN,
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-6 text-gray-500 dark:text-gray-400'>
          <div className='flex items-center'>
            <Eye className='h-4 w-4 mr-1.5' />
            <span className='text-sm'>{post.view_count}</span>
          </div>
          <button
            className='flex items-center hover:text-blue-500 transition-colors'
            onClick={() => handleLike(post.id)}
          >
            <Heart
              className={`h-4 w-4 mr-1.5 transition-colors ${
                post.is_liked ? 'fill-current text-blue-500' : ''
              }`}
            />
            <span className='text-sm'>{post.like_count}</span>
          </button>
          <div className='flex items-center'>
            <MessageSquare className='h-4 w-4 mr-1.5' />
            <span className='text-sm'>{post.comments?.length}</span>
          </div>
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-8'>
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant='secondary' className="hover:bg-gray-200 dark:hover:bg-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className='prose dark:prose-invert max-w-none prose-img:rounded-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800'>
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="whitespace-pre-wrap break-words"
        />
      </div>
    </article>
  );
}