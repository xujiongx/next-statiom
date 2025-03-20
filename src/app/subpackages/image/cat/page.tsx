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

  const fetchCatImage = async () => {
    try {
      setLoading(true);
      setImageLoaded(false);
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      setCatImage(data[0]);
    } catch (error) {
      console.error('获取猫咪图片失败:', error);
    } finally {
      setLoading(false);
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
          {catImage ? (
            <Image
              src={catImage.url}
              alt='可爱的猫咪'
              fill
              className={`object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}