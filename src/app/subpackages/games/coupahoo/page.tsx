'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CoupAhooGame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // 确保iframe加载完成
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        // 调整iframe高度以适应内容
        iframeRef.current.style.height = '80vh';
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 切换全屏模式
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      // 进入全屏模式
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`全屏模式错误: ${err.message}`);
      });
    } else {
      // 退出全屏模式
      document.exitFullscreen();
    }
  };

  return (
    <div className='p-6'>
      <div className='max-w-4xl mx-auto'>
        <Link
          href='/subpackages/games'
          className='inline-flex items-center text-muted-foreground hover:text-foreground mb-6'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回游戏列表
        </Link>

        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>CoupAhoo 游戏</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            className='flex items-center gap-1'
          >
            {isFullscreen ? (
              <>
                <Minimize className='w-4 h-4' />
                退出全屏
              </>
            ) : (
              <>
                <Maximize className='w-4 h-4' />
                全屏模式
              </>
            )}
          </Button>
        </div>

        <div 
          ref={containerRef} 
          className='w-full border rounded-lg overflow-hidden relative'
        >
          <iframe
            ref={iframeRef}
            src='/games/coupahoo/index.html'
            className='w-full border-0'
            style={{ height: '80vh' }}
            title='CoupAhoo 游戏'
            sandbox='allow-scripts allow-same-origin'
          />
        </div>
      </div>
    </div>
  );
}
