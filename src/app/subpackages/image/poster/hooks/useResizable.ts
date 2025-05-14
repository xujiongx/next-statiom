import { useRef, useEffect } from 'react';
import { TextPosition } from '../types';

interface UseResizableProps {
  position: TextPosition;
  onPositionChange: (newPosition: TextPosition) => void;
  enabled: boolean;
  resizeMode?: 'width' | 'both';
}

export function useResizable({ 
  position, 
  onPositionChange, 
  enabled, 
  resizeMode = 'width' 
}: UseResizableProps) {
  const elementRef = useRef<HTMLDivElement>(null); // 添加元素引用
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 处理调整大小开始
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = e;
    startSizeRef.current = {
      width: positionRef.current.width,
      height: positionRef.current.height || 0,
    };
    startPosRef.current = { x: clientX, y: clientY };

    onPositionChange({
      ...positionRef.current,
      isResizing: true,
    });

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // 处理调整大小移动
  const handleResizeMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = resizeMode === 'both' ? clientY - startPosRef.current.y : 0;

    const containerRect = document.getElementById('poster-canvas')?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaWidthPercent = (deltaX / containerRect.width) * 100;
    const deltaHeightPercent = (deltaY / containerRect.height) * 100;

    const newWidth = Math.max(5, Math.min(100, startSizeRef.current.width + deltaWidthPercent));
    const newHeight = resizeMode === 'both'
      ? Math.max(5, Math.min(100, (startSizeRef.current.height || 0) + deltaHeightPercent))
      : positionRef.current.height;

    const newPosition = {
      ...positionRef.current,
      width: newWidth,
      height: newHeight,
    };

    positionRef.current = newPosition;
    onPositionChange(newPosition);
  };

  // 处理调整大小结束
  const handleResizeEnd = () => {
    const finalPosition = {
      ...positionRef.current,
      isResizing: false,
    };

    positionRef.current = finalPosition;
    onPositionChange(finalPosition);

    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // 处理触摸调整大小开始
  const handleResizeTouchStart = (e: React.TouchEvent) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    startSizeRef.current = {
      width: positionRef.current.width,
      height: positionRef.current.height || 0,
    };
    startPosRef.current = { x: touch.clientX, y: touch.clientY };

    onPositionChange({
      ...positionRef.current,
      isResizing: true,
    });

    document.addEventListener('touchmove', handleResizeTouchMove, {
      passive: false,
    });
    document.addEventListener('touchend', handleResizeTouchEnd);
  };

  // 处理触摸调整大小移动
  const handleResizeTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = resizeMode === 'both' ? touch.clientY - startPosRef.current.y : 0;

    const containerRect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaWidthPercent = (deltaX / containerRect.width) * 100;
    const deltaHeightPercent = (deltaY / containerRect.height) * 100;

    const newWidth = Math.max(5, Math.min(100, startSizeRef.current.width + deltaWidthPercent));
    const newHeight = resizeMode === 'both'
      ? Math.max(5, Math.min(100, (startSizeRef.current.height || 0) + deltaHeightPercent))
      : positionRef.current.height;

    const newPosition = {
      ...positionRef.current,
      width: newWidth,
      height: newHeight,
    };

    positionRef.current = newPosition;
    onPositionChange(newPosition);
  };

  // 处理触摸调整大小结束
  const handleResizeTouchEnd = () => {
    const finalPosition = {
      ...positionRef.current,
      isResizing: false,
    };

    positionRef.current = finalPosition;
    onPositionChange(finalPosition);

    document.removeEventListener('touchmove', handleResizeTouchMove);
    document.removeEventListener('touchend', handleResizeTouchEnd);
  };

  // 修改清理事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeTouchMove);
      document.removeEventListener('touchend', handleResizeTouchEnd);
    };
  }, []);

  return {
    elementRef, // 返回元素引用
    handleResizeStart,
    handleResizeTouchStart,
  };
}