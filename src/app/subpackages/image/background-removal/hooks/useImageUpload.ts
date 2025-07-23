import { useCallback } from "react";
import { BackgroundRemovalTool } from "../backgroundRemoval";
import { Crop, PixelCrop } from "react-image-crop";
import { useToast } from "@/components/ui/use-toast"

interface UseImageUploadProps {
  setOriginalImage: (image: string) => void;
  setProcessedImage: (image: string) => void;
  setCrop: (crop: Crop | undefined) => void;
  setCompletedCrop: (crop: PixelCrop | undefined) => void;
  setCroppedPreview: (preview: string) => void;
}

export function useImageUpload({
  setOriginalImage,
  setProcessedImage,
  setCrop,
  setCompletedCrop,
  setCroppedPreview,
}: UseImageUploadProps) {
  const { toast } = useToast();

  // 文件上传处理
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      const validationError = BackgroundRemovalTool.validateFile(selectedFile);
      if (validationError) {
        toast({
          variant: "destructive",
          description: validationError,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setProcessedImage("");
        setCroppedPreview(""); // 重置裁剪预览
        // 重置裁剪状态
        setCrop(undefined);
        setCompletedCrop(undefined);
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          description: "文件读取失败，请重试",
        });
      };
      reader.readAsDataURL(selectedFile);
    },
    [toast, setOriginalImage, setProcessedImage, setCrop, setCompletedCrop, setCroppedPreview]
  );

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const validationError = BackgroundRemovalTool.validateFile(file);
        if (validationError) {
          toast({
            variant: "destructive",
            description: validationError,
          });
          return;
        }

        const event = {
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(event);
      }
    },
    [handleFileUpload, toast]
  );

  return { handleFileUpload, handleDragOver, handleDrop };
}