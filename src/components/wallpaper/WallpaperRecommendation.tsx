"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ImageType {
  id: string;
  url: string;
  created_at: string;
}

interface ApiResponse {
  code: number;
  data?: {
    images: ImageType[];
    pagination: {
      limit: number;
      offset: number;
      count: number;
    };
  };
  message?: string;
}

interface WallpaperRecommendationProps {
  limit?: number;
  className?: string;
}

export default function WallpaperRecommendation({
  limit = 3,
  className = "",
}: WallpaperRecommendationProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const fetchWallpapers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/image/list?limit=${limit}&offset=0`);
      const data: ApiResponse = await response.json();

      if (data.code === 0 && data.data) {
        setImages(data.data.images);
      } else {
        toast({
          title: "获取失败",
          description: data.message || "获取壁纸失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("获取壁纸失败:", error);
      toast({
        title: "获取失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchWallpapers();
  }, [limit]);

  return (
    <>
      <Card
        className={`${className} border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 text-white shadow-lg">
                <Eye className="w-5 h-5" />
              </div>
              今日壁纸推荐
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(limit)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse shadow-md"
                >
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-gray-400/20 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 bg-white dark:bg-gray-800"
                  onClick={() => setSelectedImage(image)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={image.url}
                    alt="壁纸"
                    className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <Eye className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">暂无壁纸数据</p>
              <Button
                variant="outline"
                onClick={fetchWallpapers}
                className="rounded-full px-8 py-2 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                重新加载
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 现代化图片预览模态框 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full animate-in zoom-in-95 duration-300">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 p-2">
              <img
                src={selectedImage.url}
                alt="壁纸预览"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              />

              {/* 关闭按钮 */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* 下载按钮 */}
              <Button
                variant="default"
                size="sm"
                className="absolute bottom-4 right-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 hover:from-purple-600 hover:to-blue-600 dark:hover:from-purple-500 dark:hover:to-blue-500 text-white border-0 shadow-lg px-6"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(selectedImage.url, selectedImage.id);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                下载高清图
              </Button>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </>
  );
}
