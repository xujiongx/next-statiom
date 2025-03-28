'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ImagePage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.code === 0) {
        setImageUrl(data.data.url);
      } else {
        throw new Error(data.message);
      }
    } catch  {
      toast({
        variant: 'destructive',
        description: '图片生成失败，请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('👨‍👦‍👦', imageUrl);

  return (
    <main className='container max-w-4xl p-6'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold mb-1'>AI 图片生成</h1>
        <p className='text-sm text-muted-foreground'>
          输入描述，生成独特的 AI 图片
        </p>
      </div>

      <div className='grid gap-4'>
        <Textarea
          placeholder='描述你想要生成的图片...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className='w-full'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              生成中...
            </>
          ) : (
            '生成图片'
          )}
        </Button>

        {imageUrl && (
          <div className='relative aspect-square w-full overflow-hidden rounded-lg border'>
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              unoptimized={true} // 添加这个属性跳过优化
            />
          </div>
        )}
      </div>
    </main>
  );
}