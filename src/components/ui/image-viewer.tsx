'use client';

import * as React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageViewerProps {
  images: { url: string; display_url: string }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (isOpen) {
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复背景滚动
      document.body.style.overflow = '';
    }

    // 添加键盘事件监听
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 当 isOpen 变化时重置当前索引
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
      onClick={onClose}
    >
      <button
        className='absolute top-4 right-4 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-[60]'
        onClick={(e) => {
          e.stopPropagation();
          console.log('关闭按钮被点击');
          onClose();
        }}
        aria-label='关闭'
      >
        <X className='w-6 h-6' />
      </button>

      <div
        className='relative w-full h-full flex items-center justify-center p-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center'>
          {/* 使用 next/image 替代 img 标签 */}
          <div className='relative w-full h-full flex items-center justify-center'>
            <Image
              src={currentImage.display_url || currentImage.url}
              alt='查看大图'
              className='object-contain'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw'
              priority
              quality={90}
              unoptimized={currentImage.url.startsWith('blob:')}
            />
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              className='absolute left-4 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors'
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label='上一张'
            >
              <ChevronLeft className='w-6 h-6' />
            </button>
            <button
              className='absolute right-4 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors'
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label='下一张'
            >
              <ChevronRight className='w-6 h-6' />
            </button>
            <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm'>
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
