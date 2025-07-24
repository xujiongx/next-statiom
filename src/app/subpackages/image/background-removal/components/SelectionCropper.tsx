import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useCallback, useRef } from "react";

interface SelectionCropperProps {
  originalImage: string;
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  completedCrop?: PixelCrop;
  updateCroppedPreview: (image: HTMLImageElement, crop: PixelCrop) => void;
  cropImageRef: React.RefObject<HTMLImageElement | null>;
}

export default function SelectionCropper({
  originalImage,
  crop,
  setCrop,
  setCompletedCrop,
  completedCrop,
  updateCroppedPreview,
  cropImageRef,
}: SelectionCropperProps) {
  // 优化节流控制
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // 使用更高效的节流函数
  const throttledUpdatePreview = useCallback(
    (image: HTMLImageElement, crop: PixelCrop) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
      
      // 如果距离上次更新时间太短，则延迟执行
      if (timeSinceLastUpdate < 200) {
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current);
        }
        
        throttleTimeoutRef.current = setTimeout(() => {
          updateCroppedPreview(image, crop);
          lastUpdateTimeRef.current = Date.now();
          throttleTimeoutRef.current = null;
        }, 200 - timeSinceLastUpdate);
      } else {
        // 可以立即执行
        updateCroppedPreview(image, crop);
        lastUpdateTimeRef.current = now;
      }
    },
    [updateCroppedPreview]
  );

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const image = e.currentTarget;
    const { naturalWidth, naturalHeight, width, height } = image;
  
    // 只在没有现有裁剪区域时才初始化
    if (!crop) {
      // 使用正确的缩放计算
      const scaleX = width / naturalWidth;
      const scaleY = height / naturalHeight;
      
      // 计算合适的裁剪尺寸（自然尺寸的60%）
      const naturalCropSize = Math.min(naturalWidth, naturalHeight) * 0.6;
      
      // 转换为显示坐标
      const displayCropSize = naturalCropSize * Math.min(scaleX, scaleY);
      
      const initialCrop = {
        unit: "px" as const,
        x: (width - displayCropSize) / 2,
        y: (height - displayCropSize) / 2,
        width: displayCropSize,
        height: displayCropSize,
      };
  
      setCrop(initialCrop);
      setCompletedCrop(initialCrop as PixelCrop);
  
      // 生成初始预览
      if (cropImageRef.current) {
        updateCroppedPreview(cropImageRef.current, initialCrop as PixelCrop);
      }
    }
  }, [crop, setCrop, setCompletedCrop, updateCroppedPreview, cropImageRef]);

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
      <div className="mb-4">
        <h3 className="font-medium mb-2">调整框选区域</h3>
        <p className="text-sm text-gray-500">
          拖动选框或调整边角手柄来选择要保留的区域
        </p>
      </div>

      <div className="relative overflow-hidden bg-gray-100 rounded-md">
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);
            if (cropImageRef.current && c) {
              throttledUpdatePreview(cropImageRef.current, c as PixelCrop);
            }
          }}
          onComplete={(c) => {
            setCompletedCrop(c);
            if (cropImageRef.current) {
              if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
                throttleTimeoutRef.current = null;
              }
              updateCroppedPreview(cropImageRef.current, c);
              lastUpdateTimeRef.current = Date.now();
            }
          }}
          aspect={undefined}
          className="max-w-full touch-manipulation"
          minWidth={30}
          minHeight={30}
        >
          <img
            ref={cropImageRef}
            src={originalImage}
            alt="原始图片"
            onLoad={onImageLoad}
            style={{ 
              maxWidth: "100%", 
              maxHeight: window.innerWidth < 768 ? "300px" : "500px",
              touchAction: "none"
            }}
            crossOrigin="anonymous"
          />
        </ReactCrop>
      </div>

      {completedCrop && (
        <div className="mt-4 text-xs sm:text-sm text-gray-500 break-all">
          选区: X: {Math.round(completedCrop.x)}, Y:{" "}
          {Math.round(completedCrop.y)}, 宽: {Math.round(completedCrop.width)},
          高: {Math.round(completedCrop.height)}
        </div>
      )}
    </div>
  );
}
