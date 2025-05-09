'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Maximize, Minimize, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface GameConfig {
  id: string;          // 游戏ID，用于构建路径
  title: string;       // 游戏标题
  path?: string;       // 游戏路径，默认为 /games/{id}/index.html
}

export default function GamePage({ config }: { config: GameConfig }) {
  const { id, title, path = `/games/${id}/index.html` } = config;
  
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
    // 兼容 iOS Safari
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  // 切换全屏模式
  const toggleFullscreen = () => {
    // 直接使用CSS模拟全屏，不使用Fullscreen API
    if (!isFullscreen) {
      // 进入全屏模式
      if (iframeRef.current && containerRef.current) {
        // 设置容器为全屏
        containerRef.current.style.position = 'fixed';
        containerRef.current.style.top = '0';
        containerRef.current.style.left = '0';
        containerRef.current.style.width = '100%';
        containerRef.current.style.height = '100%';
        containerRef.current.style.zIndex = '9999';
        containerRef.current.style.backgroundColor = '#000';
        containerRef.current.style.display = 'flex';
        containerRef.current.style.flexDirection = 'column';
        
        // 设置iframe填满容器
        const iframe = iframeRef.current;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.flex = '1';
        
        // 隐藏页面其他内容
        document.body.style.overflow = 'hidden';
        
        // 手动设置全屏状态
        setIsFullscreen(true);
      }
    } else {
      // 退出全屏模式
      if (iframeRef.current && containerRef.current) {
        // 恢复容器样式
        containerRef.current.style.position = '';
        containerRef.current.style.top = '';
        containerRef.current.style.left = '';
        containerRef.current.style.width = '';
        containerRef.current.style.height = '';
        containerRef.current.style.zIndex = '';
        containerRef.current.style.backgroundColor = '';
        containerRef.current.style.display = '';
        containerRef.current.style.flexDirection = '';
        
        // 恢复iframe样式
        const iframe = iframeRef.current;
        iframe.style.width = '100%';
        iframe.style.height = '80vh';
        iframe.style.border = '0';
        iframe.style.flex = '';
        
        // 恢复页面滚动
        document.body.style.overflow = '';
        
        // 手动设置全屏状态
        setIsFullscreen(false);
      }
    }
  };

  // 在新标签页打开游戏
  const openInNewTab = () => {
    window.open(path, '_blank');
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

        {/* 标题单独一行 */}
        <h1 className='text-2xl font-bold mb-4'>{title}</h1>
        
        {/* 按钮单独一行，右对齐 */}
        <div className='flex justify-end mb-4'>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={openInNewTab}
              className='flex items-center gap-1'
            >
              <ExternalLink className='w-4 h-4' />
              新标签页打开
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={toggleFullscreen}
              className='flex items-center gap-1'
              style={{
                position: isFullscreen ? 'fixed' : 'static',
                top: isFullscreen ? '10px' : 'auto',
                right: isFullscreen ? '10px' : 'auto',
                zIndex: isFullscreen ? '10000' : 'auto',
                backgroundColor: isFullscreen ? 'rgba(0, 0, 0, 0.5)' : '',
                color: isFullscreen ? 'white' : ''
              }}
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
        </div>

        <div
          ref={containerRef}
          className='w-full border rounded-lg overflow-hidden relative'
        >
          <iframe
            ref={iframeRef}
            src={path}
            className='w-full border-0'
            style={{ height: '80vh' }}
            title={`${title} 游戏`}
            sandbox='allow-scripts allow-same-origin'
            allow='fullscreen'
          />
        </div>
      </div>
    </div>
  );
}