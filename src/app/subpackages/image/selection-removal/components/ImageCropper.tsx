import { useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { SelectionRemovalTool } from "../selectionRemoval";

interface ImageCropperProps {
  ref: React.RefObject<HTMLImageElement | null>;
  imageUrl: string;
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  onCropChange?: (image: HTMLImageElement, crop: PixelCrop) => void;
  onCropChangeThrottled?: (image: HTMLImageElement, crop: PixelCrop) => void; // 新增节流版本
}

export function ImageCropper({
  ref,
  imageUrl,
  crop,
  setCrop,
  setCompletedCrop,
  onCropChange,
  onCropChangeThrottled,
}: ImageCropperProps) {
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const image = e.currentTarget;
      const { width, height, naturalWidth, naturalHeight } = image;
      
      // 使用自然尺寸和显示尺寸来计算更准确的裁剪区域
      const crop = SelectionRemovalTool.centerCrop(width, height, naturalWidth, naturalHeight);
      setCrop(crop);
      setCompletedCrop(crop);
      
      // 生成初始预览
      if (onCropChange) {
        onCropChange(image, crop);
      }
    },
    [setCrop, setCompletedCrop, onCropChange],
  );

  return (
    <ReactCrop
      crop={crop}
      onChange={(c) => {
        setCrop(c);
        // 拖动时使用节流版本，减少性能消耗
        if (ref.current && c && onCropChangeThrottled) {
          onCropChangeThrottled(ref.current, c as PixelCrop);
        }
      }}
      onComplete={(c) => {
        setCompletedCrop(c);
        // 完成时立即更新预览
        if (ref.current && onCropChange) {
          onCropChange(ref.current, c);
        }
      }}
      aspect={undefined}
      className="max-w-full"
    >
      <img
        ref={ref}
        src={imageUrl}
        alt="原始图片"
        onLoad={onImageLoad}
        style={{ maxWidth: "100%", maxHeight: "500px" }}
        crossOrigin="anonymous"
      />
    </ReactCrop>
  );
}
