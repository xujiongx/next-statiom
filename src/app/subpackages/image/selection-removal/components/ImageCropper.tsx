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
}

export function ImageCropper({
  ref,
  imageUrl,
  crop,
  setCrop,
  setCompletedCrop,
}: ImageCropperProps) {
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      // 初始化裁剪区域为图片中心的合适大小
      const crop = SelectionRemovalTool.centerCrop(width, height);
      setCrop(crop);
      setCompletedCrop(crop);
    },
    [setCrop, setCompletedCrop],
  );

  return (
    <ReactCrop
      crop={crop}
      onChange={(c) => setCrop(c)}
      onComplete={(c) => setCompletedCrop(c)}
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
