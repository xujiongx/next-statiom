import { useState, useCallback, useRef } from "react";
import { PixelCrop } from "react-image-crop";

export function useCropPreview() {
  const [croppedPreview, setCroppedPreview] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // 优化预览更新函数
  const updateCroppedPreview = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
    if (!crop || !image || crop.width <= 0 || crop.height <= 0) return;
    
    // 复用 canvas 元素以减少 DOM 操作
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 计算缩放比例
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;
    
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制裁剪区域
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight
    );
    
    // 使用较低质量以提高性能
    const preview = canvas.toDataURL('image/jpeg', 0.8);
    setCroppedPreview(preview);
  }, []);
  
  return { croppedPreview, setCroppedPreview, updateCroppedPreview };
}