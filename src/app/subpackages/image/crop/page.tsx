"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, Crop } from "lucide-react";
import NextImage from "next/image";
import { ImageCropTool, CropOptions } from "./imageCrop";
import { ProcessingState } from "../background-removal/backgroundRemoval";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function ImageCropPage() {
  // 状态管理
  const [originalImage, setOriginalImage] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });

  // 裁剪状态
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // 文件上传处理
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      const validationError = ImageCropTool.validateFile(selectedFile);
      if (validationError) {
        toast({
          variant: "destructive",
          description: validationError,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setOriginalImage(dataUrl);
        setProcessedImage("");
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          description: "文件读取失败，请重试",
        });
      };
      reader.readAsDataURL(selectedFile);
    },
    [toast],
  );

  // 图片加载完成后初始化裁剪区域
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      
      // 初始化裁剪区域为图片中心的合适大小
      const crop = ImageCropTool.centerCrop(width, height, 16 / 9);
      setCrop(crop);
      setCompletedCrop(crop);
    },
    [],
  );

  // 裁剪图片
  const cropImage = useCallback(async () => {
    if (!originalImage || !imageRef.current || !completedCrop) {
      return;
    }

    try {
      // 创建配置选项
      const options: CropOptions = {
        crop: completedCrop,
        onProgress: setProcessingState,
      };

      const processedDataUrl = await ImageCropTool.cropImage(
        imageRef.current,
        options,
      );

      setProcessedImage(processedDataUrl);

      toast({
        description: "图片裁剪完成！",
      });
    } catch (error) {
      console.error("处理失败:", error);
      toast({
        variant: "destructive",
        description:
          error instanceof Error ? error.message : "处理失败，请重试",
      });
    }
  }, [originalImage, completedCrop, toast]);

  // 下载处理后的图片
  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    try {
      ImageCropTool.downloadImage(processedImage);

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
        const validationError = ImageCropTool.validateFile(file);
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
    [handleFileUpload, toast],
  );

  // 计算状态
  const canProcess = useMemo(() => {
    return (
      originalImage &&
      completedCrop?.width &&
      completedCrop?.height &&
      !processingState.isProcessing
    );
  }, [originalImage, completedCrop, processingState.isProcessing]);

  return (
    <main className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Crop className="h-6 w-6" />
          图片裁剪
        </h1>
        <p className="text-sm text-muted-foreground">
          自由裁剪图片，保留需要的部分，生成新图片
        </p>
      </div>

      <div className="grid gap-6">
        {/* 上传区域 */}
        {!originalImage ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={processingState.isProcessing}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${
                processingState.isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                点击上传或拖拽图片到此处
              </p>
              <p className="text-sm text-gray-500">
                支持 JPG、PNG、WEBP 格式，最大 10MB
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 裁剪区域 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="mb-4">
                <h3 className="font-medium mb-2">调整裁剪区域</h3>
                <p className="text-sm text-gray-500">
                  拖动裁剪框或调整边角手柄来选择要保留的区域
                </p>
              </div>

              <div className="relative overflow-hidden bg-gray-100 rounded-md">
                {/* 使用ReactCrop组件 */}
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={undefined}
                  className="max-w-full"
                >
                  <img
                    ref={imageRef}
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
                  裁剪区域: X: {Math.round(completedCrop.x)}, Y:{" "}
                  {Math.round(completedCrop.y)}, 宽:{" "}
                  {Math.round(completedCrop.width)}, 高:{" "}
                  {Math.round(completedCrop.height)}
                </div>
              )}

              <Button
                onClick={cropImage}
                disabled={!canProcess}
                className="w-full mt-4"
                size="lg"
              >
                {processingState.isProcessing ? (
                  <>
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="animate-pulse">
                        {processingState.stage}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <Crop className="mr-2 h-5 w-5" />
                    裁剪图片
                  </>
                )}
              </Button>

              {/* 处理进度条 */}
              {processingState.isProcessing && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mt-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
                    style={{ width: `${processingState.progress}%` }}
                  >
                    <div className="h-2 w-2 bg-white rounded-full mr-0.5 animate-pulse"></div>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-600">
                    {processingState.stage}
                  </div>
                </div>
              )}
            </div>

            {/* 图片对比区域 */}
            {processedImage && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* 原图 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">原图</h3>
                  <div className="relative aspect-auto w-full overflow-hidden rounded-lg border bg-gray-50">
                    <NextImage
                      src={originalImage}
                      alt="原图"
                      width={500}
                      height={500}
                      className="max-w-full max-h-[400px] object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                {/* 处理后的图片 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">裁剪结果</h3>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下载 PNG
                    </Button>
                  </div>
                  <div className="relative aspect-auto w-full overflow-hidden rounded-lg border bg-gray-50">
                    <NextImage
                      src={processedImage}
                      alt="裁剪结果"
                      width={500}
                      height={500}
                      className="max-w-full max-h-[400px] object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
