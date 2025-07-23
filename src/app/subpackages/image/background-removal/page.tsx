"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Download, Scissors, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Switch } from "@/components/ui/switch";

import {
  backgroundRemovalTool,
  ProcessingState,
  BackgroundRemovalTool,
  BackgroundRemovalOptions,
  QualityLevel,
} from "./backgroundRemoval";
import { SelectionRemovalTool } from "../selection-removal/selectionRemoval";

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
  const [modelStatus, setModelStatus] = useState({
    isLoaded: false,
    hasError: false,
    error: null as string | null,
  });
  
  // 框选模式状态
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  // 裁剪状态
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  // 显示裁剪后的图片
  const [croppedPreview, setCroppedPreview] = useState<string>("");

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null); // 专门用于裁剪的图像引用
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
    [toast],
  );

  // 图片加载完成后初始化裁剪区域
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (selectionMode) {
        const { width, height } = e.currentTarget;
        
        // 初始化裁剪区域为图片中心的合适大小
        const crop = SelectionRemovalTool.centerCrop(width, height);
        setCrop(crop);
        setCompletedCrop(crop);
        
        // 生成裁剪预览
        updateCroppedPreview(e.currentTarget, crop);
      }
    },
    [selectionMode],
  );
  
  // 更新裁剪预览
  const updateCroppedPreview = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
    if (!crop || !image) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
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
      crop.height * scaleY
    );
    
    const preview = canvas.toDataURL('image/png');
    setCroppedPreview(preview);
  }, []);
  
  // 裁剪区域变化时更新预览
  useEffect(() => {
    if (selectionMode && completedCrop && cropImageRef.current) {
      updateCroppedPreview(cropImageRef.current, completedCrop);
    }
  }, [selectionMode, completedCrop, updateCroppedPreview]);

  // AI 背景移除
  const removeBackgroundAI = useCallback(async () => {
    if (!originalImage) {
      return;
    }
  
    try {
      // 根据模式选择不同的处理方法
      if (selectionMode && completedCrop && cropImageRef.current) {
        // 框选模式
        const processedDataUrl = await SelectionRemovalTool.removeSelectedBackground(
          cropImageRef.current,
          completedCrop,
          setProcessingState
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
          options
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
  }, [originalImage, modelStatus.isLoaded, toast, quality, selectionMode, completedCrop]);

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
  }, []);

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
  }, [originalImage, modelStatus.isLoaded, processingState.isProcessing, selectionMode, completedCrop]);

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

      {/* 模式切换 */}
      <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <h3 className="font-medium">抠图模式</h3>
          <p className="text-sm text-gray-500">
            {selectionMode 
              ? "框选模式：手动选择要保留的区域" 
              : "智能模式：AI 自动识别前景"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">智能模式</span>
          <Switch 
            checked={selectionMode} 
            onCheckedChange={setSelectionMode} 
          />
          <span className="text-sm text-gray-500">框选模式</span>
        </div>
      </div>

      {/* 模型状态显示 */}
      {!selectionMode && !modelStatus.isLoaded && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-800">正在加载 AI 模型...</span>
          </div>
        </div>
      )}

      {/* 模型错误显示 */}
      {!selectionMode && modelStatus.hasError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800">
              AI 模型加载失败，请刷新页面重试
            </span>
          </div>
        </div>
      )}

      {/* 隐藏的图片元素 - 用于全图模式 */}
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
            {/* 框选模式下的裁剪区域 */}
            {selectionMode && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">调整框选区域</h3>
                  <p className="text-sm text-gray-500">
                    拖动选框或调整边角手柄来选择要保留的区域
                  </p>
                </div>

                <div className="relative overflow-hidden bg-gray-100 rounded-md">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => {
                      setCrop(c);
                      if (cropImageRef.current && c) {
                        // 实时更新裁剪预览
                        updateCroppedPreview(cropImageRef.current, c as PixelCrop);
                      }
                    }}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={undefined}
                    className="max-w-full"
                  >
                    <img
                      ref={cropImageRef}
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
                    选区: X: {Math.round(completedCrop.x)}, Y:{" "}
                    {Math.round(completedCrop.y)}, 宽:{" "}
                    {Math.round(completedCrop.width)}, 高:{" "}
                    {Math.round(completedCrop.height)}
                  </div>
                )}
              </div>
            )}

            {/* 处理按钮和进度 */}
            <div className="space-y-4">
              {/* 质量选择 - 仅在智能模式下显示 */}
              {!selectionMode && (
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
              )}

              <Button
                onClick={removeBackgroundAI}
                disabled={!canProcess || (!selectionMode && modelStatus.hasError)}
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
                ) : !selectionMode && !modelStatus.isLoaded ? (
                  <>
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      等待模型加载...
                    </span>
                  </>
                ) : !selectionMode && modelStatus.hasError ? (
                  <>
                    <AlertCircle className="mr-2 h-5 w-5" />
                    模型加载失败
                  </>
                ) : (
                  <>
                    <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Scissors className="mr-2 h-5 w-5" />
                      {selectionMode ? "开始框选抠图" : "一键抠图"}
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

            {/* 图片对比区域 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 原图/裁剪预览 */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">
                  {selectionMode && croppedPreview ? "裁剪预览" : "原图"}
                </h3>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
                  <Image
                    src={selectionMode && croppedPreview ? croppedPreview : originalImage}
                    alt={selectionMode && croppedPreview ? "裁剪预览" : "原图"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    unoptimized={!!croppedPreview}
                  />
                </div>
              </div>

              {/* 处理后的图片 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">处理结果</h3>
                  <div className="flex gap-2">
                    {processedImage && (
                      <Button onClick={handleDownload} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        下载 PNG
                      </Button>
                    )}
                    <Button onClick={handleReupload} variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      重新上传
                    </Button>
                  </div>
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
          </div>
        )}
        {/* 底部说明文本 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2">使用说明</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {selectionMode ? (
              <>
                <li>• 上传图片后，拖动选框选择需要保留的区域</li>
                <li>• 点击&quot;开始框选抠图&quot;按钮，AI将保留选中区域并移除背景</li>
              </>
            ) : (
              <>
                <li>• 上传图片后点击&quot;一键抠图&quot;按钮，AI将自动识别前景并移除背景</li>
                <li>• 可选择不同质量等级，高质量处理效果更好但速度较慢</li>
              </>
            )}
            <li>• 处理完成后可直接下载透明背景的PNG图片</li>
            <li>• 点击&quot;重新上传&quot;按钮可以上传新的图片进行处理</li>
            <li>• 所有处理在您的浏览器中完成，图片不会上传到服务器</li>
            {!selectionMode && <li>• 首次使用需要下载AI模型，请耐心等待</li>}
          </ul>
        </div>
      </div>
    </main>
  );
}
