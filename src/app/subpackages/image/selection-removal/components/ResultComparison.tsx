import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Scissors, Download } from "lucide-react";

interface ResultComparisonProps {
  originalImage: string;
  processedImage: string;
  onUseAsNewImage: () => void;
  onDownload: () => void;
}

export function ResultComparison({
  originalImage,
  processedImage,
  onUseAsNewImage,
  onDownload,
}: ResultComparisonProps) {
  return (
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
          <h3 className="text-lg font-medium">抠图结果</h3>
          <div className="flex gap-2">
            <Button onClick={onUseAsNewImage} variant="outline" size="sm">
              <Scissors className="mr-2 h-4 w-4" />
              作为新图像
            </Button>
            <Button onClick={onDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              下载 PNG
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
            className="max-w-full max-h-[400px] object-contain relative z-10"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}