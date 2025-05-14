import { useRef, useEffect } from 'react';
import { TextPosition } from '../types';

interface UseTouchDraggableProps {
  position: TextPosition;
  onPositionChange: (newPosition: TextPosition) => void;
  enabled: boolean;
}

export function useTouchDraggable({ 
  position, 
  onPositionChange, 
  enabled 
}: UseTouchDraggableProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };

    onPositionChange({
      ...positionRef.current,
      isDragging: true,
    });

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // 处理触摸移动
  const handleTouchMove = (e: TouchEvent) => {
    if (!elementRef.current) return;

    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;

    const containerRect = elementRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;

    const newX = Math.max(0, Math.min(100, positionRef.current.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100, positionRef.current.y + deltaYPercent));

    const newPosition = {
      ...positionRef.current,
      x: newX,
      y: newY,
    };

    positionRef.current = newPosition;
    onPositionChange(newPosition);

    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    const finalPosition = {
      ...positionRef.current,
      isDragging: false,
    };

    positionRef.current = finalPosition;
    onPositionChange(finalPosition);

    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  // 清理事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return {
    elementRef,
    handleTouchStart,
  };
}