import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/community';
import { useState } from 'react';
import Image from 'next/image';
import ImagePreviewModal from '@/components/wallpaper/ImagePreviewModal'

interface PostDetailProps {
  post: Post;
  handleLike: (postId: string) => void;
}

export function PostDetail({ post, handleLike }: PostDetailProps) {
  const [selectedImage, setSelectedImage] = useState<number | undefined>(undefined);

  // 处理图片点击，打开大图查看
  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <article className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {post.author.nickname}
            </span>
            <span className="mx-2 text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.created_at), {
                locale: zhCN,
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{post.view_count}</span>
          </div>
          <button
            className="flex items-center hover:text-blue-500 transition-colors"
            onClick={() => handleLike(post.id)}
          >
            <Heart
              className={`h-4 w-4 mr-1.5 transition-colors ${
                post.is_liked ? "fill-current text-blue-500" : ""
              }`}
            />
            <span className="text-sm">{post.like_count}</span>
          </button>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{post.comments?.length}</span>
          </div>
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="whitespace-pre-wrap break-words"
        />
      </div>

      {/* 图片列表展示 - 九宫格布局 */}
      {post.images && post.images.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {post.images.slice(0, 9).map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <div className="w-full h-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.display_url || image.url}
                      alt={`图片 ${index + 1}`}
                      className="object-cover cursor-pointer transition-transform hover:scale-105"
                      onClick={() => handleImageClick(index)}
                      fill
                      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
                      unoptimized={image.url.startsWith("blob:")}
                    />
                    {post.images.length > 9 && index === 8 && (
                      <div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                        onClick={() => handleImageClick(8)}
                      >
                        <span className="text-white text-xl font-bold">
                          +{post.images.length - 9}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 使用更新后的图片预览模态框组件 */}
      {selectedImage !== undefined && (
        <ImagePreviewModal
          images={post.images}
          initialIndex={selectedImage}
          onClose={() => setSelectedImage(undefined)}
        />
      )}
    </article>
  );
}
