import React from 'react';
import { TextPosition } from '../types';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import { useTouchDraggable } from '../hooks/useTouchDraggable';

interface DraggableTextProps {
  children: React.ReactNode;
  position: TextPosition;
  style?: React.CSSProperties;
  onPositionChange: (newPosition: TextPosition) => void;
  enabled: boolean;
  id: string;
  resizeMode?: 'width' | 'both';
}

export function DraggableText({
  children,
  position,
  style,
  onPositionChange,
  enabled,
  id,
  resizeMode = 'width',
}: DraggableTextProps) {
  const { elementRef: dragRef, handleDragStart } = useDraggable({
    position,
    onPositionChange,
    enabled,
  });

  const { elementRef: resizeRef, handleResizeStart, handleResizeTouchStart } = useResizable({
    position,
    onPositionChange,
    enabled,
    resizeMode,
  });

  const { elementRef: touchRef, handleTouchStart } = useTouchDraggable({
    position,
    onPositionChange,
    enabled,
  });

  const isMoving = position.isDragging || position.isResizing;

  return (
    <div
      ref={(el) => {
        dragRef.current = el;
        touchRef.current = el;
        resizeRef.current = el; // 添加 resize 引用
      }}
      id={id}
      className={`absolute ${enabled ? 'cursor-move' : ''}`}
      style={{
        ...style,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${position.width}%`,
        height: resizeMode === 'both' ? `${position.height}%` : 'auto',
        userSelect: 'none',
        border: enabled
          ? isMoving
            ? '2px dashed #3b82f6'
            : '1px dashed transparent'
          : 'none',
        padding: enabled ? '8px' : '0',
        transition: position.isDragging ? 'none' : 'border-color 0.2s',
        zIndex: isMoving ? 100 : 10,
        touchAction: 'none',
        pointerEvents: 'auto',
        position: 'absolute',
        display: 'inline-block',
        backgroundColor: enabled && isMoving ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
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
            cursor: resizeMode === 'both' ? 'se-resize' : 'e-resize',
          }}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeTouchStart}
        />
      )}
    </div>
  );
}
