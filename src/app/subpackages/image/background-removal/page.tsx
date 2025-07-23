"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import { Crop, PixelCrop } from "react-image-crop";

import { ProcessingState, QualityLevel } from "./backgroundRemoval";
import { useModelStatus } from "./hooks/useModelStatus";
import { useImageUpload } from "./hooks/useImageUpload";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { useCropPreview } from "./hooks/useCropPreview";

import ModeSelector from "./components/ModeSelector";
import ModelStatus from "./components/ModelStatus";
import ImageUploader from "./components/ImageUploader";
import SelectionCropper from "./components/SelectionCropper";
import QualitySelector from "./components/QualitySelector";
import ProcessButton from "./components/ProcessButton";
import ProgressBar from "./components/ProgressBar";
import ImageComparison from "./components/ImageComparison";
import Instructions from "./components/Instructions";

export default function BackgroundRemovalPage() {
  // 状态管理
  const [originalImage, setOriginalImage] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });
  const [quality, setQuality] = useState<QualityLevel>("medium");
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // 使用自定义钩子
  const { modelStatus } = useModelStatus();

  const { croppedPreview, setCroppedPreview, updateCroppedPreview } =
    useCropPreview();
  const { handleFileUpload, handleDragOver, handleDrop } = useImageUpload({
    setOriginalImage,
    setProcessedImage,
    setCrop,
    setCompletedCrop,
    setCroppedPreview,
  });
  const {
    removeBackgroundAI,
    handleDownload,
    handleReupload,
    canProcess,
    imageRef,
    cropImageRef,
  } = useImageProcessing({
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
  });

  return (
    <main className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          AI 抠图工具
        </h1>
        <p className="text-sm text-muted-foreground">
          {selectionMode
            ? "框选需要保留的区域，一键抠图生成透明背景图片"
            : "智能识别前景，一键去除背景，生成透明图片，无需专业技能"}
        </p>
      </div>

      <ModeSelector
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
      />

      <ModelStatus selectionMode={selectionMode} modelStatus={modelStatus} />

      <div className="grid gap-6">
        {!originalImage ? (
          <ImageUploader
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileUpload={handleFileUpload}
            processingState={processingState}
          />
        ) : (
          <div className="space-y-6">
            {selectionMode && (
              <SelectionCropper
                cropImageRef={cropImageRef}
                originalImage={originalImage}
                crop={crop}
                setCrop={setCrop}
                setCompletedCrop={setCompletedCrop}
                completedCrop={completedCrop}
                updateCroppedPreview={updateCroppedPreview}
              />
            )}

            <div className="space-y-4">
              {!selectionMode && (
                <QualitySelector quality={quality} setQuality={setQuality} />
              )}

              <ProcessButton
                removeBackgroundAI={removeBackgroundAI}
                canProcess={!!canProcess}
                selectionMode={selectionMode}
                modelStatus={modelStatus}
                processingState={processingState}
              />

              {processingState.isProcessing && (
                <ProgressBar processingState={processingState} />
              )}
            </div>

            <ImageComparison
              originalImage={originalImage}
              processedImage={processedImage}
              selectionMode={selectionMode}
              croppedPreview={croppedPreview}
              handleDownload={handleDownload}
              handleReupload={handleReupload}
            />

            {/* 添加隐藏的图像元素，用于处理 */}
            <div className="hidden">
              {/* 全图模式使用的图像引用 */}
              <img
                ref={imageRef}
                src={originalImage}
                alt="隐藏的原始图片"
                crossOrigin="anonymous"
              />

              {/* 选框模式使用的图像引用 */}
              <img
                ref={cropImageRef}
                src={originalImage}
                alt="隐藏的裁剪图片"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}

        <Instructions selectionMode={selectionMode} />
      </div>
    </main>
  );
}
