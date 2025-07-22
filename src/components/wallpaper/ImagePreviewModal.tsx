import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
interface ImageType {
  id?: string;
  url: string;
  created_at?: string;
}

interface ImagePreviewModalProps {
  // 支持传入单张图片或图片数组
  images: ImageType[] | ImageType | null;
  // 当前选中的图片索引（可选）
  initialIndex?: number;
  onClose: () => void;
}

export default function ImagePreviewModal({
  images,
  initialIndex = 0,
  onClose,
}: ImagePreviewModalProps) {
  // 将输入统一处理为数组
  const imageArray = Array.isArray(images) ? images : images ? [images] : [];

  // 确保初始索引有效
  const validInitialIndex =
    initialIndex >= 0 && initialIndex < imageArray.length ? initialIndex : 0;

  // 当前显示的图片索引
  const [currentIndex, setCurrentIndex] = useState(validInitialIndex);
  // 当前显示的图片
  const [currentImage, setCurrentImage] = useState<ImageType>(
    imageArray[validInitialIndex],
  );

  // 当索引变化时更新当前图片
  useEffect(() => {
    if (imageArray[currentIndex]) {
      setCurrentImage(imageArray[currentIndex]);
    }
  }, [currentIndex, imageArray]);

  // 切换到上一张图片
  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + imageArray.length) % imageArray.length,
    );
  };

  // 切换到下一张图片
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageArray.length);
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `wallpaper-${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "下载成功",
        description: "壁纸已保存到本地",
      });
    } catch (error) {
      console.error("下载失败:", error);
      toast({
        title: "下载失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 如果没有图片，不渲染组件
  if (imageArray.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-6xl max-h-full animate-in zoom-in-95 duration-300">
        {/* 主内容区域 */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800/20 backdrop-blur-lg p-4">
          {/* 图片显示区域 */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={currentImage?.url}
              alt="壁纸预览"
              className="max-w-full max-h-[75vh] object-contain"
            />

            {/* 图片计数指示器 - 移至图片上方中央 */}
            {imageArray.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                {currentIndex + 1} / {imageArray.length}
              </div>
            )}
          </div>

          {/* 控制按钮区域 - 重新排列为底部控制栏 */}
          <div className="flex items-center justify-between mt-4 px-2">
            {/* 左侧：导航按钮组 */}
            <div className="flex items-center gap-2">
              {imageArray.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/70 shadow-md border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/70 shadow-md border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {/* 右侧：功能按钮组 */}
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 hover:from-purple-600 hover:to-blue-600 dark:hover:from-purple-500 dark:hover:to-blue-500 text-white border-0 shadow-md px-5 py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(
                    currentImage.url,
                    currentImage.id || dayjs().unix().toLocaleString(),
                  );
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-700/70 shadow-md border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 缩略图导航 - 移至底部，更紧凑的布局 */}
          {imageArray.length > 1 && (
            <div className="mt-4 flex justify-center">
              <div className="flex gap-2 overflow-x-auto py-2 px-2 max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                {imageArray.map((img, index) => (
                  <div
                    key={img.url}
                    className={`w-14 h-10 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                      index === currentIndex
                        ? "ring-2 ring-blue-400 scale-105"
                        : "opacity-60 hover:opacity-90"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`缩略图 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* 自定义滚动条样式 */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }

        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 9999px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}
