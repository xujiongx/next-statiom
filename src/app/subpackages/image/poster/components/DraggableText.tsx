import React, { useRef, useEffect } from 'react';
import { TextPosition } from '../types';

interface DraggableTextProps {
  children: React.ReactNode;
  position: TextPosition;
  style?: React.CSSProperties;
  onPositionChange: (newPosition: TextPosition) => void;
  enabled: boolean;
  id: string;
}

export function DraggableText({
  children,
  position,
  style,
  onPositionChange,
  enabled,
  id,
}: DraggableTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0 });
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

    e.preventDefault(); // 阻止页面滚动

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;

    const containerRect =
      elementRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;

    const newX = Math.max(
      0,
      Math.min(100, positionRef.current.x + deltaXPercent)
    );
    const newY = Math.max(
      0,
      Math.min(100, positionRef.current.y + deltaYPercent)
    );

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

  // 处理触摸调整大小开始
  const handleResizeTouchStart = (e: React.TouchEvent) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    startSizeRef.current = { width: positionRef.current.width };
    startPosRef.current = { x: touch.clientX, y: 0 };

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
    if (!elementRef.current) return;

    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;

    const containerRect =
      elementRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaWidthPercent = (deltaX / containerRect.width) * 100;
    const newWidth = Math.max(
      20,
      Math.min(100, startSizeRef.current.width + deltaWidthPercent)
    );

    const newPosition = {
      ...positionRef.current,
      width: newWidth,
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

    const containerRect =
      elementRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    // 计算新位置（百分比）
    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;

    // 更新位置，确保不超出边界
    const newX = Math.max(
      0,
      Math.min(100, positionRef.current.x + deltaXPercent)
    );
    const newY = Math.max(
      0,
      Math.min(100, positionRef.current.y + deltaYPercent)
    );

    const newPosition = {
      ...positionRef.current,
      x: newX,
      y: newY,
    };

    // 更新位置引用和状态
    positionRef.current = newPosition;
    onPositionChange(newPosition);

    // 更新起始位置
    startPosRef.current = { x: clientX, y: clientY };
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    const finalPosition = {
      ...positionRef.current,
      isDragging: false,
    };

    // 更新位置引用和状态
    positionRef.current = finalPosition;
    onPositionChange(finalPosition);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // 处理调整大小开始
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    const { clientX } = e;
    startSizeRef.current = { width: positionRef.current.width };
    startPosRef.current = { x: clientX, y: 0 };

    onPositionChange({
      ...positionRef.current,
      isResizing: true,
    });

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // 处理调整大小移动
  const handleResizeMove = (e: MouseEvent) => {
    if (!elementRef.current) return;

    const { clientX } = e;
    const deltaX = clientX - startPosRef.current.x;

    const containerRect =
      elementRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaWidthPercent = (deltaX / containerRect.width) * 100;
    const newWidth = Math.max(
      20,
      Math.min(100, startSizeRef.current.width + deltaWidthPercent)
    );

    const newPosition = {
      ...positionRef.current,
      width: newWidth,
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

  // 清理事件监听
  useEffect(() => {
    // 组件卸载时清理所有事件监听
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleResizeTouchMove);
      document.removeEventListener('touchend', handleResizeTouchEnd);
    };
  }, []);

  const isMoving =
    positionRef.current.isDragging || positionRef.current.isResizing;

  return (
    <div
      ref={elementRef}
      id={id}
      className={`absolute ${enabled ? 'cursor-move' : ''}`}
      style={{
        ...style,
        left: `${positionRef.current.x}%`,
        top: `${positionRef.current.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${positionRef.current.width}%`,
        userSelect: 'none',
        border: enabled
          ? isMoving
            ? '2px dashed #3b82f6'
            : '1px dashed transparent'
          : 'none',
        padding: enabled ? '8px' : '0',
        transition: position.isDragging ? 'none' : 'border-color 0.2s',
        zIndex:
          positionRef.current.isDragging || positionRef.current.isResizing
            ? 100
            : 10,
        touchAction: 'none',
        pointerEvents: 'auto',
        position: 'absolute',
        display: 'inline-block',
        backgroundColor:
          enabled && isMoving ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleTouchStart}
    >
      {children}

      {enabled && (
        <div
          className='absolute right-0 bottom-0 w-6 h-6 rounded-full cursor-se-resize'
          style={{
            transform: 'translate(50%, 50%)',
            opacity: position.isResizing ? 1 : 0.7,
            transition: 'opacity 0.2s',
            pointerEvents: 'auto',
            zIndex: 101,
            backgroundColor: enabled && isMoving ? '#3b82f6' : 'transparent',
          }}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeTouchStart}
        />
      )}
    </div>
  );
}
