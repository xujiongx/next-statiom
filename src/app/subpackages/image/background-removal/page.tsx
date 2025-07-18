"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Download, Scissors, AlertCircle } from "lucide-react";
import Image from "next/image";

import {
  backgroundRemovalTool,
  ProcessingState,
  BackgroundRemovalTool,
  BackgroundRemovalOptions,
  QualityLevel,
} from "./backgroundRemoval";

export default function BackgroundRemovalPage() {
  // 状态管理
  // 状态管理
  const [originalImage, setOriginalImage] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });
  const [quality, setQuality] = useState<QualityLevel>("medium");
  const [modelStatus, setModelStatus] = useState({
    isLoaded: false,
    hasError: false,
    error: null as string | null,
  });

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // 检查模型状态
  useEffect(() => {
    const checkModelStatus = () => {
      const status = backgroundRemovalTool.getModelStatus();
      setModelStatus(status);

      if (status.isLoaded && !status.hasError) {
        toast({
          description: "AI 模型加载完成！",
        });
      } else if (status.hasError) {
        toast({
          variant: "destructive",
          description: "模型加载失败，请刷新页面重试",
        });
      }
    };

    // 立即检查一次
    checkModelStatus();

    // 如果模型还没加载完成，定期检查
    const interval = setInterval(() => {
      const status = backgroundRemovalTool.getModelStatus();
      if (status.isLoaded) {
        setModelStatus(status);
        clearInterval(interval);

        if (!status.hasError) {
          toast({
            description: "AI 模型加载完成！",
          });
        } else {
          toast({
            variant: "destructive",
            description: "模型加载失败，请刷新页面重试",
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

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

  // AI 背景移除
  const removeBackgroundAI = useCallback(async () => {
    if (!originalImage || !imageRef.current || !modelStatus.isLoaded) {
      return;
    }
  
    try {
      // 创建配置选项
      const options: BackgroundRemovalOptions = {
        onProgress: setProcessingState,
        quality: quality, // 传递质量参数
      };
  
      const processedDataUrl = await backgroundRemovalTool.removeBackground(
        imageRef.current,
        options
      );
  
      setProcessedImage(processedDataUrl);
  
      toast({
        description: "AI 背景移除完成！",
      });
    } catch (error) {
      console.error("处理失败:", error);
      toast({
        variant: "destructive",
        description:
          error instanceof Error ? error.message : "处理失败，请重试",
      });
    }
  }, [originalImage, modelStatus.isLoaded, toast, quality]); // 添加 quality 依赖

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
    [handleFileUpload, toast],
  );

  // 计算状态
  const canProcess = useMemo(() => {
    return (
      originalImage && modelStatus.isLoaded && !processingState.isProcessing
    );
  }, [originalImage, modelStatus.isLoaded, processingState.isProcessing]);

  return (
    <main className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          AI 一键抠图
        </h1>
        <p className="text-sm text-muted-foreground">
          智能识别前景，一键去除背景，生成透明图片，无需专业技能
        </p>
      </div>

      {/* 模型状态显示 */}
      {!modelStatus.isLoaded && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-800">正在加载 AI 模型...</span>
          </div>
        </div>
      )}

      {/* 模型错误显示 */}
      {modelStatus.hasError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800">
              AI 模型加载失败，请刷新页面重试
            </span>
          </div>
        </div>
      )}

      {/* 隐藏的图片元素 */}
      {originalImage && (
        <img
          ref={imageRef}
          src={originalImage}
          alt="Original"
          style={{ display: "none" }}
          crossOrigin="anonymous"
        />
      )}

      <div className="grid gap-6">
        {/* 上传区域 */}
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

        {/* 处理按钮和进度 */}
        {originalImage && (
          <div className="space-y-4">
            {/* 质量选择 */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={quality === "low" ? "default" : "outline"}
                onClick={() => setQuality("low")}
                className="w-full"
              >
                低质量
                <span className="ml-1 text-xs">(快速)</span>
              </Button>
              <Button
                variant={quality === "medium" ? "default" : "outline"}
                onClick={() => setQuality("medium")}
                className="w-full"
              >
                中质量
                <span className="ml-1 text-xs">(平衡)</span>
              </Button>
              <Button
                variant={quality === "high" ? "default" : "outline"}
                onClick={() => setQuality("high")}
                className="w-full"
              >
                高质量
                <span className="ml-1 text-xs">(精细)</span>
              </Button>
            </div>

            <Button
              onClick={removeBackgroundAI}
              disabled={!canProcess || modelStatus.hasError}
              className="w-full relative overflow-hidden group"
              size="lg"
            >
              {processingState.isProcessing ? (
                <>
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="animate-pulse">{processingState.stage}</span>
                  </span>
                </>
              ) : !modelStatus.isLoaded ? (
                <>
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    等待模型加载...
                  </span>
                </>
              ) : modelStatus.hasError ? (
                <>
                  <AlertCircle className="mr-2 h-5 w-5" />
                  模型加载失败
                </>
              ) : (
                <>
                  <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Scissors className="mr-2 h-5 w-5" />
                    一键抠图
                  </span>
                  <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 w-0 group-hover:w-full transition-all duration-300"></span>
                </>
              )}
            </Button>

            {/* 处理进度条 */}
            {processingState.isProcessing && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
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
        )}

        {/* 图片对比区域 */}
        {originalImage && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* 原图 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">原图</h3>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
                <Image
                  src={originalImage}
                  alt="原图"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* 处理后的图片 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">处理结果</h3>
                {processedImage && (
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    下载 PNG
                  </Button>
                )}
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
                {processedImage ? (
                  <>
                    {/* 透明背景网格 */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]" />
                    <Image
                      src={processedImage}
                      alt="处理结果"
                      fill
                      className="object-contain relative z-10"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={true}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Scissors className="mx-auto h-12 w-12 mb-2" />
                      <p>AI 处理后的图片将显示在这里</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* 底部说明文本 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2">使用说明</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              •
              上传图片后点击&quot;一键抠图&quot;按钮，AI将自动识别前景并移除背景
            </li>
            <li>• 处理完成后可直接下载透明背景的PNG图片</li>
            <li>• 所有处理在您的浏览器中完成，图片不会上传到服务器</li>
            <li>• 首次使用需要下载AI模型，请耐心等待</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
