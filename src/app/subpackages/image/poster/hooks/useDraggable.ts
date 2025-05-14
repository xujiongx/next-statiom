import { useRef, useEffect } from 'react';
import { TextPosition } from '../types';

interface UseDraggableProps {
  position: TextPosition;
  onPositionChange: (newPosition: TextPosition) => void;
  enabled: boolean;
}

export function useDraggable({ position, onPositionChange, enabled }: UseDraggableProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = e;
    startPosRef.current = { x: clientX, y: clientY };

    onPositionChange({
      ...positionRef.current,
      isDragging: true,
    });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (!elementRef.current) return;

    const { clientX, clientY } = e;
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;

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

    startPosRef.current = { x: clientX, y: clientY };
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    const finalPosition = {
      ...positionRef.current,
      isDragging: false,
    };

    positionRef.current = finalPosition;
    onPositionChange(finalPosition);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // 清理事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, []);

  return {
    elementRef,
    handleDragStart,
  };
}