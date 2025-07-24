import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Scissors, Download } from "lucide-react";

interface ResultComparisonProps {
  originalImage: string;
  processedImage?: string;
  croppedPreview?: string;
  erasedImage?: string;
  onUseAsNewImage: () => void;
  onDownload: () => void;
}

export function ResultComparison({
  originalImage,
  processedImage,
  croppedPreview,
  erasedImage,
  onUseAsNewImage,
  onDownload,
}: ResultComparisonProps) {
  // 计算要显示的图片数量
  const imageCount = [originalImage, croppedPreview, erasedImage, processedImage].filter(Boolean).length;
  const gridCols = imageCount <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid gap-4 sm:gap-6 ${gridCols}`}>
      {/* 原图 */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-medium">原图</h3>
        <div className="relative aspect-auto w-full overflow-hidden rounded-lg border bg-gray-50">
          <NextImage
            src={originalImage}
            alt="原图"
            width={500}
            height={500}
            className="max-w-full max-h-[250px] sm:max-h-[400px] object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* 裁剪预览 */}
      {croppedPreview && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-medium">裁剪预览</h3>
          <div className="relative aspect-auto w-full overflow-hidden rounded-lg border bg-gray-50">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]" />
            <NextImage
              src={croppedPreview}
              alt="裁剪预览"
              width={500}
              height={500}
              className="max-w-full max-h-[250px] sm:max-h-[400px] object-contain relative z-10"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* 橡皮擦处理结果 */}
      {erasedImage && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-medium">橡皮擦处理</h3>
          <div className="relative aspect-auto w-full overflow-hidden rounded-lg border bg-gray-50">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]" />
            <NextImage
              src={erasedImage}
              alt="橡皮擦处理结果"
              width={500}
              height={500}
              className="max-w-full max-h-[250px] sm:max-h-[400px] object-contain relative z-10"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* 最终处理结果 */}
      {processedImage && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-base sm:text-lg font-medium">抠图结果</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onUseAsNewImage} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Scissors className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">作为新图像</span>
                <span className="sm:hidden">新图像</span>
              </Button>
              <Button onClick={onDownload} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">下载 PNG</span>
                <span className="sm:hidden">下载</span>
              </Button>
            </div>
          </div>
          <div className="relative aspect-auto w-full overflow-hidden rounded-lg border bg-gray-50">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]" />
            <NextImage
              src={processedImage}
              alt="抠图结果"
              width={500}
              height={500}
              className="max-w-full max-h-[250px] sm:max-h-[400px] object-contain relative z-10"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}