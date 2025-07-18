"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, Move, Lock, Unlock } from "lucide-react";
import NextImage from "next/image";
import { ImageResizeTool, ResizeOptions } from "./imageResize";
import { ProcessingState } from "../background-removal/backgroundRemoval";

export default function ImageResizePage() {
  // 状态管理
  const [originalImage, setOriginalImage] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // 文件上传处理
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      const validationError = ImageResizeTool.validateFile(selectedFile);
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
        
        // 获取原始图片尺寸
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({
            width: img.width,
            height: img.height
          });
          
          // 设置初始调整尺寸为原图尺寸
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = dataUrl;
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

  // 处理宽度变化，如果保持比例则同步调整高度
  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  }, [maintainAspectRatio, originalDimensions]);

  // 处理高度变化，如果保持比例则同步调整宽度
  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  }, [maintainAspectRatio, originalDimensions]);

  // 调整图片尺寸
  const resizeImage = useCallback(async () => {
    if (!originalImage || !imageRef.current) {
      return;
    }

    try {
      // 创建配置选项
      const options: ResizeOptions = {
        width,
        height,
        maintainAspectRatio,
        onProgress: setProcessingState,
      };

      const processedDataUrl = await ImageResizeTool.resizeImage(
        imageRef.current,
        options
      );

      setProcessedImage(processedDataUrl);

      toast({
        description: "图片尺寸调整完成！",
      });
    } catch (error) {
      console.error("处理失败:", error);
      toast({
        variant: "destructive",
        description:
          error instanceof Error ? error.message : "处理失败，请重试",
      });
    }
  }, [originalImage, width, height, maintainAspectRatio, toast]);

  // 下载处理后的图片
  const handleDownload = useCallback(() => {
    if (!processedImage) return;

    try {
      ImageResizeTool.downloadImage(processedImage);

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
        const validationError = ImageResizeTool.validateFile(file);
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
      originalImage && width > 0 && height > 0 && !processingState.isProcessing
    );
  }, [originalImage, width, height, processingState.isProcessing]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">图片尺寸调整</h1>
        <p className="text-gray-500">
          上传图片，调整尺寸大小，保存调整后的图片
        </p>
      </div>

      {!originalImage ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
          />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-1">点击或拖拽上传图片</p>
          <p className="text-sm text-gray-500">
            支持 JPG、PNG、WEBP 格式，最大 10MB
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 原始图片（隐藏但用于处理） */}
          <div className="hidden">
            <img
              ref={imageRef}
              src={originalImage}
              alt="原始图片"
              crossOrigin="anonymous"
            />
          </div>

          {/* 尺寸调整控制 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="width" className="mb-2 block">
                  宽度 (像素): {width}
                </Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="width-slider"
                    min={10}
                    max={3000}
                    step={1}
                    value={[width]}
                    onValueChange={(values) => handleWidthChange(values[0])}
                    className="flex-1"
                  />
                  <Input
                    id="width"
                    type="number"
                    min={10}
                    value={width}
                    onChange={(e) =>
                      handleWidthChange(parseInt(e.target.value) || 10)
                    }
                    className="w-20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="height" className="mb-2 block">
                  高度 (像素): {height}
                </Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="height-slider"
                    min={10}
                    max={3000}
                    step={1}
                    value={[height]}
                    onValueChange={(values) => handleHeightChange(values[0])}
                    className="flex-1"
                  />
                  <Input
                    id="height"
                    type="number"
                    min={10}
                    value={height}
                    onChange={(e) =>
                      handleHeightChange(parseInt(e.target.value) || 10)
                    }
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className="mr-2"
              >
                {maintainAspectRatio ? (
                  <>
                    <Lock className="h-4 w-4 mr-1" /> 保持比例
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-1" /> 自由比例
                  </>
                )}
              </Button>

              {originalDimensions && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWidth(originalDimensions.width);
                    setHeight(originalDimensions.height);
                  }}
                  className="mr-2"
                >
                  重置为原始尺寸
                </Button>
              )}

              <div className="text-sm text-gray-500 ml-auto">
                {originalDimensions && (
                  <>
                    原始尺寸: {originalDimensions.width} ×{" "}
                    {originalDimensions.height}
                  </>
                )}
              </div>
            </div>

            <Button
              onClick={resizeImage}
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
                  <Move className="mr-2 h-5 w-5" />
                  调整尺寸
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

          {/* 图片预览区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 原图 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-medium mb-2 text-center">原始图片</h3>
              <div className="relative aspect-auto overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                <NextImage
                  src={originalImage}
                  alt="原始图片"
                  width={500}
                  height={500}
                  className="max-w-full max-h-[400px] object-contain"
                  unoptimized
                />
              </div>
              {originalDimensions && (
                <p className="text-sm text-center mt-2 text-gray-500">
                  {originalDimensions.width} × {originalDimensions.height} 像素
                </p>
              )}
            </div>

            {/* 处理后的图片 */}
            {processedImage ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-medium mb-2 text-center">调整后的图片</h3>
                <div className="relative aspect-auto overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  <NextImage
                    src={processedImage}
                    alt="调整后的图片"
                    width={500}
                    height={500}
                    className="max-w-full max-h-[400px] object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-sm text-center mt-2 text-gray-500">
                  {width} × {height} 像素
                </p>
                <Button
                  onClick={handleDownload}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  下载图片
                </Button>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  调整尺寸后的图片将显示在这里
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-8 text-sm text-gray-500 space-y-2">
        <h3 className="font-medium text-gray-700">使用说明：</h3>
        <p>1. 上传图片：点击上传区域或拖拽图片到上传区域</p>
        <p>2. 调整尺寸：使用滑块或输入框设置目标宽度和高度</p>
        <p>3. 保持比例：默认开启，可点击按钮切换</p>
        <p>4. 点击&quot;调整尺寸&quot;按钮处理图片</p>
        <p>5. 下载：处理完成后，点击&quot;下载图片&quot;保存结果</p>
        <p>注意：所有处理在浏览器本地完成，不会上传您的图片到服务器</p>
      </div>
    </div>
  );
}