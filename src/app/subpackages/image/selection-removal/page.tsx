"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Scissors } from "lucide-react";
import { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// 自定义钩子
import { useEraser } from "./useEraser";
import { useImageUpload } from "./hooks/useImageUpload";
import { useImageProcessing } from "./hooks/useImageProcessing";

// 组件
import { ImageUploader } from "./components/ImageUploader";
import { ImageCropper } from "./components/ImageCropper";
import { EraserCanvas } from "./components/EraserCanvas";
import { ProcessingControls } from "./components/ProcessingControls";
import { ResultComparison } from "./components/ResultComparison";

export default function SelectionRemovalPage() {
  // 使用自定义钩子
  const {
    originalImage,
    setOriginalImage,
    handleFileUpload,
    handleDragOver,
    handleDrop,
  } = useImageUpload();

  const {
    processedImage,
    setProcessedImage,
    processingState,
    setProcessingState,
    handleRemoveBackground,
    handleDownload,
    resetProcessing,
  } = useImageProcessing();

  // 裁剪状态
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  // 添加裁剪预览状态
  const [croppedPreview, setCroppedPreview] = useState<string>("");
  // 添加橡皮擦处理后的图片状态
  const [erasedImage, setErasedImage] = useState<string>("");

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // 使用橡皮擦钩子
  const {
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
  } = useEraser({
    size: 20,
    onProgress: setProcessingState,
  });

  // 当原始图片变化且处于橡皮擦模式时初始化Canvas
  useEffect(() => {
    if (originalImage && isEraserMode) {
      initCanvas(originalImage).catch((error) => {
        console.error("初始化Canvas失败:", error);
        toast({
          variant: "destructive",
          description:
            error instanceof Error ? error.message : "初始化Canvas失败",
        });
      });
    }
  }, [originalImage, isEraserMode, toast]); // 移除initCanvas依赖项

  // 处理抠图
  const handleProcessImage = useCallback(() => {
    console.log("🚶", originalImage, imageRef.current, completedCrop);
    if (!originalImage || !imageRef.current || !completedCrop) {
      return;
    }
    handleRemoveBackground(imageRef.current, completedCrop);
  }, [originalImage, completedCrop, handleRemoveBackground]);

  // 完成橡皮擦操作
  const handleCompleteErasing = useCallback(() => {
    const processedDataUrl = completeErasing();
    if (!processedDataUrl) {
      toast({
        variant: "destructive",
        description: "处理失败，请重试",
      });
      return;
    }

    // 保存橡皮擦处理后的图片
    setErasedImage(processedDataUrl);
    // 同时设置为新的原始图像
    setOriginalImage(processedDataUrl);
    toggleEraserMode(); // 退出橡皮擦模式
  
    toast({
      description: "橡皮擦处理完成！",
    });
  }, [completeErasing, toggleEraserMode, toast, setOriginalImage]);

  // 将处理后的图片设置为新的原始图像
  const handleUseAsNewImage = useCallback(() => {
    if (!processedImage) return;

    try {
      // 设置新的原始图像
      setOriginalImage(processedImage);
      // 清除处理后的图像
      setProcessedImage("");
      // 重置裁剪状态
      setCrop(undefined);
      setCompletedCrop(undefined);
      // 重置处理状态
      resetProcessing();

      toast({
        description: "已将抠图结果设置为新图像",
      });
    } catch {
      toast({
        variant: "destructive",
        description: "操作失败，请重试",
      });
    }
  }, [
    processedImage,
    toast,
    setOriginalImage,
    setProcessedImage,
    resetProcessing,
  ]);

  // 计算状态
  const canProcess = useMemo(() => {
    return (
      originalImage &&
      completedCrop?.width &&
      completedCrop?.height &&
      !processingState.isProcessing
    );
  }, [originalImage, completedCrop, processingState.isProcessing]);

  // 生成裁剪预览 - 添加节流优化
  const generateCroppedPreview = useCallback(
    (image: HTMLImageElement, crop: PixelCrop) => {
      if (!crop || !image) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

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
        crop.height * scaleY,
      );

      const preview = canvas.toDataURL("image/png");
      setCroppedPreview(preview);
    },
    [],
  );

  // 节流版本的预览生成函数
  const throttledGeneratePreview = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;
      return (image: HTMLImageElement, crop: PixelCrop) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          generateCroppedPreview(image, crop);
        }, 100); // 100ms 节流
      };
    })(),
    [generateCroppedPreview],
  );

  return (
    <main className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          框选抠图
        </h1>
        <p className="text-sm text-muted-foreground">
          框选需要保留的区域，一键抠图生成透明背景图片
        </p>
      </div>

      <div className="grid gap-6">
        {/* 上传区域 */}
        {!originalImage ? (
          <ImageUploader
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onFileUpload={handleFileUpload}
            isProcessing={processingState.isProcessing}
          />
        ) : (
          <div className="space-y-6">
            {/* 裁剪区域 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="mb-4">
                <h3 className="font-medium mb-2">调整框选区域</h3>
                <p className="text-sm text-gray-500">
                  拖动选框或调整边角手柄来选择要保留的区域
                </p>
              </div>

              {/* 添加橡皮擦模式切换按钮 */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={toggleEraserMode}
                  variant={isEraserMode ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 13-5 5a2.83 2.83 0 0 1-4 0l-5-5a2.83 2.83 0 0 1 0-4l8-8a2.83 2.83 0 0 1 4 0l5 5a2.83 2.83 0 0 1 0 4l-8 8" />
                    <path d="M15 9 9 15" />
                  </svg>
                  {isEraserMode ? "退出橡皮擦模式" : "使用橡皮擦"}
                </Button>

                {isEraserMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">橡皮擦大小:</span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={eraserSize}
                      onChange={(e) => setEraserSize(Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-xs text-gray-500">
                      {eraserSize}px
                    </span>
                  </div>
                )}
              </div>

              <div className="relative overflow-hidden bg-gray-100 rounded-md">
                {/* 原始图片和裁剪区域 */}
                {!isEraserMode ? (
                  <ImageCropper
                    ref={imageRef}
                    imageUrl={originalImage}
                    crop={crop}
                    setCrop={setCrop}
                    setCompletedCrop={setCompletedCrop}
                    onCropChange={generateCroppedPreview}
                    onCropChangeThrottled={throttledGeneratePreview}
                  />
                ) : (
                  /* 橡皮擦Canvas */
                  <EraserCanvas
                    canvasRef={canvasRef}
                    eraserSize={eraserSize}
                    setEraserSize={setEraserSize}
                    handleMouseDown={handleMouseDown}
                    handleMouseMove={handleMouseMove}
                    handleMouseUp={handleMouseUp}
                    handleTouchStart={handleTouchStart}
                    handleTouchMove={handleTouchMove}
                    handleTouchEnd={handleTouchEnd}
                    onComplete={handleCompleteErasing}
                    onCancel={toggleEraserMode}
                  />
                )}
              </div>

              {completedCrop && !isEraserMode && (
                <div className="mt-4 text-sm text-gray-500">
                  选区: X: {Math.round(completedCrop.x)}, Y:{" "}
                  {Math.round(completedCrop.y)}, 宽:{" "}
                  {Math.round(completedCrop.width)}, 高:{" "}
                  {Math.round(completedCrop.height)}
                </div>
              )}

              {/* 抠图按钮 */}
              {!isEraserMode && (
                <ProcessingControls
                  onProcess={handleProcessImage}
                  canProcess={!!canProcess}
                  processingState={processingState}
                />
              )}
            </div>

            {/* 图片对比区域 */}
            {(processedImage || croppedPreview || erasedImage) && (
              <ResultComparison
                originalImage={originalImage}
                processedImage={processedImage}
                croppedPreview={croppedPreview}
                onUseAsNewImage={handleUseAsNewImage}
                onDownload={handleDownload}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
