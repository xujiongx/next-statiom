import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Scissors } from "lucide-react";

interface ImageComparisonProps {
  originalImage: string;
  processedImage: string;
  selectionMode: boolean;
  croppedPreview: string;
  handleDownload: () => void;
  handleReupload: () => void;
  handleUseAsNewImage?: () => void; // 添加新的属性
}

export default function ImageComparison({
  originalImage,
  processedImage,
  selectionMode,
  croppedPreview,
  handleDownload,
  handleReupload,
  handleUseAsNewImage,
}: ImageComparisonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized={!!croppedPreview}
          />
        </div>
      </div>

      {/* 处理后的图片 */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-medium">处理结果</h3>
          <div className="flex flex-wrap gap-2">
            {processedImage && handleUseAsNewImage && (
              <Button onClick={handleUseAsNewImage} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Scissors className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">作为新图像</span>
                <span className="sm:hidden">新图像</span>
              </Button>
            )}
            {processedImage && (
              <Button onClick={handleDownload} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">下载 PNG</span>
                <span className="sm:hidden">下载</span>
              </Button>
            )}
            <Button onClick={handleReupload} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">重新上传</span>
              <span className="sm:hidden">重传</span>
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
  );
}