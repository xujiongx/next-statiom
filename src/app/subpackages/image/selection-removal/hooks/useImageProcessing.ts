import { useState, useCallback } from "react";
import { PixelCrop } from "react-image-crop";
import { useToast } from "@/components/ui/use-toast";
import { SelectionRemovalTool } from "../selectionRemoval";
import { ProcessingState } from "../../background-removal/backgroundRemoval";

export function useImageProcessing() {
  const [processedImage, setProcessedImage] = useState<string>("");
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });
  const { toast } = useToast();

  const handleRemoveBackground = useCallback(
    async (imageElement: HTMLImageElement, completedCrop: PixelCrop) => {
      if (!imageElement || !completedCrop) {
        return;
      }

      try {
        const processedDataUrl = await SelectionRemovalTool.removeSelectedBackground(
          imageElement,
          completedCrop,
          setProcessingState
        );

        setProcessedImage(processedDataUrl);

        toast({
          description: "框选区域抠图完成！",
        });
      } catch (error) {
        console.error("处理失败:", error);
        toast({
          variant: "destructive",
          description: error instanceof Error ? error.message : "处理失败，请重试",
        });
      }
    },
    [toast]
  );

  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    try {
      SelectionRemovalTool.downloadImage(processedImage);

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

  const resetProcessing = useCallback(() => {
    setProcessedImage("");
    setProcessingState({
      isProcessing: false,
      progress: 0,
      stage: "",
    });
  }, []);

  return {
    processedImage,
    setProcessedImage,
    processingState,
    setProcessingState,
    handleRemoveBackground,
    handleDownload,
    resetProcessing,
  };
}