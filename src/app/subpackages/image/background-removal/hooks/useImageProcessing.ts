import { useCallback, useMemo, useRef } from "react";
import { Crop, PixelCrop } from "react-image-crop";
import {
  backgroundRemovalTool,
  BackgroundRemovalTool,
  BackgroundRemovalOptions,
  ProcessingState,
  QualityLevel,
} from "../backgroundRemoval";
import { SelectionRemovalTool } from "../../selection-removal/selectionRemoval";
import { useToast } from "@/components/ui/use-toast";

interface UseImageProcessingProps {
  processingState: ProcessingState;
  originalImage: string;
  processedImage: string;
  modelStatus: { isLoaded: boolean; hasError: boolean; error: string | null };
  selectionMode: boolean;
  completedCrop?: PixelCrop;
  quality: QualityLevel;
  setProcessingState: (state: ProcessingState) => void;
  setProcessedImage: (image: string) => void;
  setCroppedPreview: (preview: string) => void;
  setCrop: (crop: Crop | undefined) => void;
  setCompletedCrop: (crop: PixelCrop | undefined) => void;
  setOriginalImage: (image: string) => void;
}

export function useImageProcessing({
  processingState,
  originalImage,
  processedImage,
  modelStatus,
  selectionMode,
  completedCrop,
  quality,
  setProcessingState,
  setProcessedImage,
  setCroppedPreview,
  setCrop,
  setCompletedCrop,
  setOriginalImage,
}: UseImageProcessingProps) {
  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // 图片加载完成后初始化裁剪区域
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (selectionMode) {
        const { width, height } = e.currentTarget;

        // 初始化裁剪区域为图片中心的合适大小
        const crop = SelectionRemovalTool.centerCrop(width, height);
        setCrop(crop);
        setCompletedCrop(crop);
      }
    },
    [selectionMode, setCrop, setCompletedCrop],
  );

  // AI 背景移除
  const removeBackgroundAI = useCallback(async () => {
    if (!originalImage) {
      return;
    }

    try {
      // 根据模式选择不同的处理方法
      if (selectionMode && completedCrop && cropImageRef.current) {
        // 框选模式
        const processedDataUrl =
          await SelectionRemovalTool.removeSelectedBackground(
            cropImageRef.current,
            completedCrop,
            setProcessingState,
          );

        setProcessedImage(processedDataUrl);

        toast({
          description: "框选区域抠图完成！",
        });
      } else if (!selectionMode && imageRef.current && modelStatus.isLoaded) {
        // 全图模式
        const options: BackgroundRemovalOptions = {
          onProgress: setProcessingState,
          quality: quality,
        };

        const processedDataUrl = await backgroundRemovalTool.removeBackground(
          imageRef.current,
          options,
        );

        setProcessedImage(processedDataUrl);

        toast({
          description: "AI 背景移除完成！",
        });
      } else {
        throw new Error("处理条件不满足");
      }
    } catch (error) {
      console.error("处理失败:", error);
      toast({
        variant: "destructive",
        description:
          error instanceof Error ? error.message : "处理失败，请重试",
      });
    }
  }, [
    originalImage,
    modelStatus.isLoaded,
    toast,
    quality,
    selectionMode,
    completedCrop,
    setProcessedImage,
    setProcessingState,
  ]);

  // 下载处理
  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    try {
      BackgroundRemovalTool.downloadImage(processedImage);

      toast({
        description: "图片下载成功！",
      });
    } catch {
      toast({
        variant: "destructive",
        description: "下载失败，请重试",
      });
    }
  }, [processedImage, toast]);

  // 重新上传图片
  const handleReupload = useCallback(() => {
    setOriginalImage("");
    setProcessedImage("");
    setCroppedPreview("");
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [
    setOriginalImage,
    setProcessedImage,
    setCroppedPreview,
    setCrop,
    setCompletedCrop,
  ]);

  // 计算状态
  const canProcess = useMemo(() => {
    if (selectionMode) {
      return (
        originalImage &&
        completedCrop?.width &&
        completedCrop?.height &&
        !processingState.isProcessing
      );
    } else {
      return (
        originalImage && modelStatus.isLoaded && !processingState.isProcessing
      );
    }
  }, [
    originalImage,
    modelStatus.isLoaded,
    processingState.isProcessing,
    selectionMode,
    completedCrop,
  ]);

  return {
    removeBackgroundAI,
    handleDownload,
    handleReupload,
    canProcess,
    onImageLoad,
    imageRef,
    cropImageRef,
  };
}
