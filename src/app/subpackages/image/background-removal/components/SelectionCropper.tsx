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
  cropImageRef: React.RefObject<HTMLImageElement | null>; // 添加外部传入的引用
}

export default function SelectionCropper({
  originalImage,
  crop,
  setCrop,
  setCompletedCrop,
  completedCrop,
  updateCroppedPreview,
  cropImageRef, // 使用外部传入的引用
}: SelectionCropperProps) {
  // 添加节流控制
  const throttleTimeoutRef = useRef<number | null>(null);
  
  // 使用节流函数包装预览更新
  const throttledUpdatePreview = useCallback(
    (image: HTMLImageElement, crop: PixelCrop) => {
      if (throttleTimeoutRef.current !== null) {
        return; // 如果已经有等待执行的更新，则跳过
      }
      
      throttleTimeoutRef.current = window.setTimeout(() => {
        updateCroppedPreview(image, crop);
        throttleTimeoutRef.current = null;
      }, 150); // 150ms的节流间隔
    },
    [updateCroppedPreview]
  );

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    // 初始化裁剪区域为图片中心的合适大小
    if (!crop) {
      const initialCrop = {
        unit: "px",
        x: width / 4,
        y: height / 4,
        width: width / 2,
        height: height / 2,
      } as Crop;

      setCrop(initialCrop);
      setCompletedCrop(initialCrop as PixelCrop);

      if (cropImageRef.current) {
        updateCroppedPreview(cropImageRef.current, initialCrop as PixelCrop);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
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
              // 使用节流函数更新预览，减少更新频率
              throttledUpdatePreview(cropImageRef.current, c as PixelCrop);
            }
          }}
          onComplete={(c) => {
            setCompletedCrop(c);
            // 拖动完成时立即更新一次预览，确保最终状态准确
            if (cropImageRef.current) {
              updateCroppedPreview(cropImageRef.current, c);
            }
          }}
          aspect={undefined}
          className="max-w-full"
        >
          <img
            ref={cropImageRef} // 使用外部传入的引用
            src={originalImage}
            alt="原始图片"
            onLoad={onImageLoad}
            style={{ maxWidth: "100%", maxHeight: "500px" }}
            crossOrigin="anonymous"
          />
        </ReactCrop>
      </div>

      {completedCrop && (
        <div className="mt-4 text-sm text-gray-500">
          选区: X: {Math.round(completedCrop.x)}, Y:{" "}
          {Math.round(completedCrop.y)}, 宽: {Math.round(completedCrop.width)},
          高: {Math.round(completedCrop.height)}
        </div>
      )}
    </div>
  );
}
