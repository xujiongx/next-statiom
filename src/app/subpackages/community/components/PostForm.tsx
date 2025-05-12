'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload, UploadedImage } from '@/components/ui/image-upload';

interface PostFormProps {
  initialValues?: {
    title: string;
    content: string;
    tags: string[];
    images: UploadedImage[];
  };
  onSubmit: (values: {
    title: string;
    content: string;
    tags: string[];
    images?: UploadedImage[];
  }) => Promise<void>;
  submitText?: string;
}

export function PostForm({ initialValues, onSubmit, submitText = '发布帖子' }: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>(initialValues?.images||[]);
  
  const router = useRouter();
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags,
        images: images.length > 0 ? images : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          标题
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入帖子标题"
          maxLength={100}
          required
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          内容
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入帖子内容..."
          rows={8}
          required
        />
      </div>
      
      {/* 图片上传组件 */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium mb-2">
          上传图片
        </label>
        <ImageUpload 
          value={images}
          onChange={setImages}
          maxFiles={9}
          maxSize={5}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          标签 (最多5个)
        </label>
        <div className="flex items-center">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="添加标签..."
            className="mr-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={handleAddTag}
            disabled={!tagInput.trim() || tags.length >= 5}
          >
            添加
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <div 
                key={tag} 
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          最多添加5个标签，按Enter键添加
        </p>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : submitText}
        </Button>
      </div>
    </form>
  );
}