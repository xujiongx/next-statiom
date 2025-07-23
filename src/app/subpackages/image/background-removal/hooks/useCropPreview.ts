import { useState, useCallback } from "react";
import { PixelCrop } from "react-image-crop";



export function useCropPreview() {
  const [croppedPreview, setCroppedPreview] = useState<string>("");
  
  // 更新裁剪预览
  const updateCroppedPreview = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
    if (!crop || !image) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // 计算缩放比例
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    
    const preview = canvas.toDataURL('image/png');
    setCroppedPreview(preview);
  }, []);
  
  return { croppedPreview, setCroppedPreview, updateCroppedPreview };
}