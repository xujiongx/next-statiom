'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export default function CatPage() {
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [catImage, setCatImage] = useState<CatImage | null>(null);
  const [prevImage, setPrevImage] = useState<CatImage | null>(null);

  const fetchCatImage = async () => {
    try {
      setLoading(true);
      setImageLoaded(false);
      // 保存当前图片作为过渡
      if (catImage) {
        setPrevImage(catImage);
      }
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      setCatImage(data[0]);
    } catch (error) {
      console.error('获取猫咪图片失败:', error);
    }
  };

  useEffect(() => {
    fetchCatImage();
  }, []);

  return (
    <div className='container p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>我爱看猫猫</h1>
        <Button variant='outline' onClick={fetchCatImage} disabled={loading}>
          {loading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <RefreshCw className='h-4 w-4' />
          )}
          <span className='ml-2'>换一只</span>
        </Button>
      </div>

      <div className='w-full max-w-3xl mx-auto'>
        <div className='relative w-full rounded-lg overflow-hidden' 
             style={{ paddingBottom: catImage ? `${(catImage.height / catImage.width) * 100}%` : '75%' }}>
          {prevImage && !imageLoaded && (
            <Image
              src={prevImage.url}
              alt='上一只可爱的猫咪'
              fill
              className='object-contain opacity-50'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {catImage && (
            <Image
              src={catImage.url}
              alt='可爱的猫咪'
              fill
              className={`object-contain transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onLoad={() => {
                setImageLoaded(true);
                setLoading(false);
              }}
            />
          )}
          {loading && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}