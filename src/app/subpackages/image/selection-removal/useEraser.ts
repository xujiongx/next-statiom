import { useState, useRef, useCallback, useEffect } from "react";
import { ProcessingState } from "../background-removal/backgroundRemoval";

export interface EraserOptions {
  size?: number;
  onProgress?: (state: ProcessingState) => void;
}

export interface UseEraserResult {
  isEraserMode: boolean;
  eraserSize: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  toggleEraserMode: () => void;
  setEraserSize: (size: number) => void;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchEnd: () => void;
  completeErasing: () => string | null;
  initCanvas: (imageDataUrl: string) => Promise<void>;
}

export function useEraser(options: EraserOptions = {}): UseEraserResult {
  // 状态管理
  const [isEraserMode, setIsEraserMode] = useState<boolean>(false);
  const [eraserSize, setEraserSize] = useState<number>(options.size || 20);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 添加缩放比例状态
  const [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  
  // 修改初始化Canvas函数
  const initCanvas = useCallback(
    async (imageDataUrl: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error("Canvas元素不存在"));
          return;
        }

        const img = new Image();
        img.onload = () => {
          // 设置canvas尺寸与图片一致
          canvas.width = img.width;
          canvas.height = img.height;

          // 获取绘图上下文
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("无法创建Canvas上下文"));
            return;
          }

          // 绘制图片到canvas
          ctx.drawImage(img, 0, 0, img.width, img.height);
          ctxRef.current = ctx;
          
          // 延迟计算缩放比例，确保Canvas已经渲染
          setTimeout(() => {
            const containerWidth = canvas.clientWidth || img.width;
            const containerHeight = canvas.clientHeight || img.height;
            
            // 避免除以零
            const scaleX = containerWidth ? img.width / containerWidth : 1;
            const scaleY = containerHeight ? img.height / containerHeight : 1;
            
            setScale({ x: scaleX, y: scaleY });
          }, 0);

          options.onProgress?.({
            isProcessing: false,
            progress: 100,
            stage: "Canvas初始化完成",
          });

          resolve();
        };

        img.onerror = () => {
          reject(new Error("图片加载失败"));
        };

        options.onProgress?.({
          isProcessing: true,
          progress: 30,
          stage: "正在加载图片...",
        });

        img.src = imageDataUrl;
      });
    },
    [options],
  );

  // 切换橡皮擦模式
  const toggleEraserMode = useCallback(() => {
    setIsEraserMode((prev) => !prev);
  }, []);

  // 开始擦除
  const startErasing = useCallback(
    (x: number, y: number) => {
      if (!ctxRef.current) return;

      setIsErasing(true);
      setLastPosition({ x, y });

      // 设置橡皮擦样式
      const ctx = ctxRef.current;
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = eraserSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [eraserSize],
  );

  // 擦除过程
  const erase = useCallback(
    (x: number, y: number) => {
      if (!isErasing || !ctxRef.current || !lastPosition) return;

      const ctx = ctxRef.current;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);

      setLastPosition({ x, y });
    },
    [isErasing, lastPosition],
  );

  // 停止擦除
  const stopErasing = useCallback(() => {
    if (!ctxRef.current) return;

    ctxRef.current.closePath();
    setIsErasing(false);
    setLastPosition(null);
  }, []);

  // 处理鼠标事件
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isEraserMode || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // 应用缩放比例
      const x = (e.clientX - rect.left) * scale.x;
      const y = (e.clientY - rect.top) * scale.y;

      startErasing(x, y);
    },
    [isEraserMode, startErasing, scale],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isEraserMode || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // 应用缩放比例
      const x = (e.clientX - rect.left) * scale.x;
      const y = (e.clientY - rect.top) * scale.y;

      erase(x, y);
    },
    [isEraserMode, erase, scale],
  );

  const handleMouseUp = useCallback(() => {
    if (!isEraserMode) return;

    stopErasing();
  }, [isEraserMode, stopErasing]);

  // 同样修改触摸事件处理函数
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isEraserMode || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      
      // 应用缩放比例
      const x = (touch.clientX - rect.left) * scale.x;
      const y = (touch.clientY - rect.top) * scale.y;

      startErasing(x, y);
    },
    [isEraserMode, startErasing, scale],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isEraserMode || !canvasRef.current) return;

      e.preventDefault(); // 阻止页面滚动

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      
      // 应用缩放比例
      const x = (touch.clientX - rect.left) * scale.x;
      const y = (touch.clientY - rect.top) * scale.y;

      erase(x, y);
    },
    [isEraserMode, erase, scale],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isEraserMode) return;

    stopErasing();
  }, [isEraserMode, stopErasing]);

  // 完成擦除并获取结果
  const completeErasing = useCallback((): string | null => {
    if (!canvasRef.current) return null;

    // 重置绘图模式
    if (ctxRef.current) {
      ctxRef.current.globalCompositeOperation = "source-over";
    }

    // 获取处理后的图像
    return canvasRef.current.toDataURL("image/png");
  }, []);

  // 当橡皮擦大小变化时更新上下文
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = eraserSize;
    }
  }, [eraserSize]);

  return {
    isEraserMode,
    eraserSize,
    canvasRef,
    toggleEraserMode,
    setEraserSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    completeErasing,
    initCanvas,
  };
}
