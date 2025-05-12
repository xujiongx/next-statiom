"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { ApiResponse } from "@/api/auth";
import Image from "next/image";

// 定义 ImgBB 上传响应的接口
interface ImgBBUploadResponse {
  url: string;
  display_url: string;
  filename: string;
  size?: number;
  time?: string;
  expiration?: string;
  delete_url?: string;
}

export interface UploadedImage {
  url: string;
  display_url: string;
  filename: string;
  size?: number;
}

export interface ImageUploadProps {
  onChange: (images: UploadedImage[]) => void;
  value?: UploadedImage[];
  maxFiles?: number;
  maxSize?: number; // 单位：MB
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  onChange,
  value = [],
  maxFiles = 5,
  maxSize = 5,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 组件挂载时，如果已有图片，生成预览
  React.useEffect(() => {
    // 清理旧的预览URL
    previews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    // 如果有图片但没有预览，生成预览
    if (value.length > 0 && previews.length === 0) {
      const newPreviews = value.map(item => item.display_url || item.url);
      setPreviews(newPreviews);
    }
    
    // 组件卸载时清理预览URL
    return () => {
      previews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [value]);

  // 上传图片到ImgBB
  const uploadToImgBB = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response: ApiResponse<ImgBBUploadResponse> = await http.post(
        '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.code !== 0) {
        throw new Error('上传失败');
      }
      
      return {
        url: response.data.url,
        display_url: response.data.display_url,
        filename: response.data.filename,
        size: response.data.size,
      };
    } catch (error) {
      console.error('上传图片失败:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // 检查文件大小
      const oversizedFiles = newFiles.filter(
        file => file.size > maxSize * 1024 * 1024
      );
      
      if (oversizedFiles.length > 0) {
        alert(`以下文件超过${maxSize}MB限制：${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
      
      // 限制文件数量
      const allowedFiles = newFiles.slice(0, maxFiles - value.length);
      
      if (allowedFiles.length > 0) {
        // 创建新的预览URL
        const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
        const previewsBeforeUpload = [...previews];
        setPreviews([...previews, ...newPreviews]);
        
        // 开始上传
        setIsUploading(true);
        
        try {
          // 上传所有图片
          const uploadPromises = allowedFiles.map(file => uploadToImgBB(file));
          const results = await Promise.all(uploadPromises);
          
          // 过滤出成功上传的图片
          const uploadedImages = results.filter(Boolean) as UploadedImage[];
          
          if (uploadedImages.length > 0) {
            // 更新状态
            onChange([...value, ...uploadedImages]);
            
            // 如果有部分上传失败，只删除失败的预览
            if (uploadedImages.length < allowedFiles.length) {
              // 计算失败的数量
              const failedCount = allowedFiles.length - uploadedImages.length;
              // 只删除失败的预览
              const newPreviews = [...previews];
              newPreviews.splice(previews.length - failedCount, failedCount);
              setPreviews(newPreviews);
              
              // 释放失败图片的预览URL
              for (let i = 1; i <= failedCount; i++) {
                const index = previews.length - i;
                if (previews[index] && previews[index].startsWith('blob:')) {
                  URL.revokeObjectURL(previews[index]);
                }
              }
              
              alert('部分图片上传失败，请重试');
            }
          } else {
            // 如果没有成功上传的图片，移除所有新预览
            const newPreviews = [...previewsBeforeUpload];
            setPreviews(newPreviews);
            
            // 释放所有新预览URL
            newPreviews.forEach((url, index) => {
              if (index >= previewsBeforeUpload.length && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
              }
            });
            
            alert('上传图片失败，请重试');
          }
        } catch (error) {
          console.error('上传图片失败:', error);
          alert('上传图片失败，请重试');
          
          // 移除所有新预览
          const newPreviews = [...previewsBeforeUpload];
          setPreviews(newPreviews);
          
          // 释放所有新预览URL
          for (let i = 0; i < newPreviews.length; i++) {
            if (i >= previewsBeforeUpload.length && newPreviews[i].startsWith('blob:')) {
              URL.revokeObjectURL(newPreviews[i]);
            }
          }
        } finally {
          setIsUploading(false);
        }
      }
      
      // 重置input，允许重复选择相同文件
      e.target.value = '';
    }
  };
  
  const handleRemoveImage = (index: number) => {
    // 释放预览URL
    if (previews[index] && previews[index].startsWith('blob:')) {
      URL.revokeObjectURL(previews[index]);
    }
    
    const newPreviews = [...previews];
    const newImages = [...value];
    
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviews(newPreviews);
    onChange(newImages);
  };

  // 处理拖拽事件
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // 处理拖拽放置
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (files.length === 0) {
        alert('请上传图片文件');
        return;
      }
      
      // 创建一个类似于文件输入的事件对象
      const mockEvent = {
        target: {
          files: e.dataTransfer.files,
          value: ''
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      await handleImageUpload(mockEvent);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 上传按钮 - 移到顶部 */}
      {value.length < maxFiles && !disabled && (
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors",
            dragActive 
              ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30" 
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">点击或拖拽图片到此处上传</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">支持 JPG、PNG、GIF 格式，单张图片不超过{maxSize}MB</p>
            
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={disabled || isUploading}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              className="relative"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  选择图片
                </>
              )}
            </Button>
            
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              已上传 {value.length}/{maxFiles} 张图片
            </p>
          </div>
        </div>
      )}
      
      {/* 图片预览区域 - 九宫格布局 */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                <div className="relative w-full h-full">
                  <Image 
                    src={preview} 
                    alt={`预览图 ${index + 1}`} 
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
                    unoptimized={preview.startsWith('blob:')}
                  />
                  {isUploading && index >= value.length && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                disabled={disabled || (isUploading && index >= value.length)}
                aria-label="删除图片"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}