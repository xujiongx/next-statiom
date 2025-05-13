'use client';

import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Image as ImageIcon,
  X,
  Upload,
  Loader2,
  Crop,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { http } from '@/lib/http';
import { ApiResponse } from '@/api/auth';
import Image from 'next/image';
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

export interface SingleImageUploadProps {
  onChange: (image: UploadedImage | null) => void;
  value?: UploadedImage | null;
  maxSize?: number; // 单位：MB
  className?: string;
  disabled?: boolean;
  aspectRatio?: number; // 宽高比，如 16/9, 1, 4/3 等
  placeholder?: string;
  buttonText?: string;
  enableCrop?: boolean; // 是否启用裁剪功能
}

export function SingleImageUpload({
  onChange,
  value = null,
  maxSize = 5,
  className,
  disabled = false,
  aspectRatio = 1,
  placeholder = '支持 JPG、PNG、GIF 格式，图片不超过5MB',
  buttonText = '选择图片',
  enableCrop = true, // 默认启用裁剪
}: SingleImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    value?.display_url || value?.url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 裁剪相关状态
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // 计算最佳裁剪区域
  const centerCrop = useCallback(
    (mediaWidth: number, mediaHeight: number) => {
      // 确保有效的宽高
      if (!mediaWidth || !mediaHeight) {
        return {
          unit: '%' as const,
          width: 80,
          height: aspectRatio ? 80 / aspectRatio : 80,
          x: 10,
          y: 10,
        };
      }
      
      // 计算图片的实际宽高比
      const imageRatio = mediaWidth / mediaHeight;
      const targetRatio = aspectRatio || 1; // 如果没有指定宽高比，默认使用1:1
      
      let cropWidth, cropHeight, x, y;
      
      // 根据图片和目标比例的关系确定裁剪区域
      if (Math.abs(imageRatio - targetRatio) < 0.01) {
        // 如果图片比例与目标比例非常接近，使用大部分图片区域
        cropWidth = cropHeight = 90;
        x = 5;
        y = 5;
      } else if (imageRatio > targetRatio) {
        // 图片比例比目标比例更宽
        // 以高度为基准，计算对应的宽度
        cropHeight = 90; // 使用90%的高度
        cropWidth = cropHeight * targetRatio / imageRatio;
        
        // 确保裁剪宽度合理
        cropWidth = Math.min(cropWidth, 90);
        
        // 居中放置裁剪框
        x = (100 - cropWidth) / 2;
        y = 5;
      } else {
        // 图片比例比目标比例更高
        // 以宽度为基准，计算对应的高度
        cropWidth = 90; // 使用90%的宽度
        cropHeight = cropWidth / targetRatio * imageRatio;
        
        // 确保裁剪高度合理
        cropHeight = Math.min(cropHeight, 90);
        
        // 居中放置裁剪框
        x = 5;
        y = (100 - cropHeight) / 2;
      }
      
      // 确保所有值都是有效的数字
      return {
        unit: '%' as const,
        width: isNaN(cropWidth) ? 80 : cropWidth,
        height: isNaN(cropHeight) ? 80 : cropHeight,
        x: isNaN(x) ? 10 : x,
        y: isNaN(y) ? 10 : y,
      };
    },
    [aspectRatio]
  );

  // 组件挂载时，如果已有图片，生成预览
  React.useEffect(() => {
    // 清理旧的预览URL
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    // 如果有图片但没有预览，生成预览
    if (value && !preview) {
      setPreview(value.display_url || value.url);
    }

    // 组件卸载时清理预览URL
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, value]);

  // 图片加载完成后更新裁剪区域
  const onImageLoad = useCallback(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      console.log('🥽', width, height);
      const newCrop = centerCrop(width, height);
      setCrop(newCrop);
    }
  }, [centerCrop]);

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
      const file = e.target.files[0];

      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        alert(`文件超过${maxSize}MB限制`);
        return;
      }

      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);

      if (enableCrop) {
        // 如果启用裁剪，先显示裁剪界面
        setCropImage(previewUrl);
        setShowCrop(true);
      } else {
        // 不裁剪，直接设置预览并上传
        setPreview(previewUrl);
        uploadImage(file);
      }

      // 重置input，允许重复选择相同文件
      e.target.value = '';
    }
  };

  // 上传图片
  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      // 上传图片
      const uploadedImage = await uploadToImgBB(file);

      if (uploadedImage) {
        // 更新状态
        onChange(uploadedImage);
      } else {
        // 上传失败，清除预览
        setPreview(null);
        alert('上传图片失败，请重试');
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      alert('上传图片失败，请重试');

      // 清除预览
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 完成裁剪
  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) {
      return;
    }

    // 创建画布并绘制裁剪区域
    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // 转换为Blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          return;
        }

        // 创建新的File对象
        const croppedFile = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });

        // 创建预览URL
        const croppedUrl = URL.createObjectURL(blob);
        setPreview(croppedUrl);

        // 关闭裁剪界面
        setShowCrop(false);
        setCropImage(null);

        // 上传裁剪后的图片
        await uploadImage(croppedFile);
      },
      'image/jpeg',
      0.95
    );
  };

  // 取消裁剪
  const handleCancelCrop = () => {
    setShowCrop(false);
    setCropImage(null);

    // 清理URL
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }
  };

  const handleRemoveImage = () => {
    // 释放预览URL
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    onChange(null);
  };

  // 处理拖拽事件
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // 处理拖拽放置
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

      // 创建一个类似于文件输入的事件对象
      const mockEvent = {
        target: {
          files: [file],
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await handleImageUpload(mockEvent);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 裁剪界面 */}
      {showCrop && cropImage && (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-hidden'>
            <div className='flex flex-col h-full'>
              <h3 className='text-lg font-medium mb-4'>裁剪图片</h3>

              <div className='flex-1 min-h-0 mb-4'>
                <div className='h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden'>
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    className='max-h-[calc(90vh-10rem)] mx-auto'
                    circularCrop={false}
                    keepSelection={true}
                    ruleOfThirds={true}
                  >
                    <img
                      ref={imgRef}
                      src={cropImage}
                      alt='裁剪预览'
                      className='max-w-full h-auto object-contain'
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className='flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700'>
                <Button
                  variant='outline'
                  onClick={handleCancelCrop}
                  className='min-w-[80px]'
                >
                  取消
                </Button>
                <Button onClick={handleCropComplete} className='min-w-[80px]'>
                  <Check className='w-4 h-4 mr-2' />
                  确认
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 上传区域 */}
      {!preview && !disabled && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-4 transition-colors',
            dragActive
              ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className='flex flex-col items-center justify-center py-6'>
            <div className='w-16 h-16 mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
              {enableCrop ? (
                <Crop className='w-8 h-8 text-gray-500 dark:text-gray-400' />
              ) : (
                <ImageIcon className='w-8 h-8 text-gray-500 dark:text-gray-400' />
              )}
            </div>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              {enableCrop ? '上传并裁剪图片' : '点击或拖拽图片到此处上传'}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
              {placeholder}
            </p>

            <input
              id='single-image-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageUpload}
              disabled={disabled || isUploading}
            />

            <Button
              type='button'
              variant='outline'
              className='relative'
              onClick={() =>
                document.getElementById('single-image-upload')?.click()
              }
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className='w-4 h-4 mr-2' />
                  {buttonText}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 图片预览区域 */}
      {preview && (
        <div className='relative group'>
          <div
            className={cn(
              'relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700',
              'shadow-sm hover:shadow-md transition-all duration-300',
              'bg-gray-50 dark:bg-gray-900',
              aspectRatio ? `aspect-[${aspectRatio}]` : 'aspect-square'
            )}
            style={{ minHeight: '200px' }}
          >
            <div className='absolute inset-0 flex items-center justify-center'>
              <Image
                src={preview}
                alt='预览图'
                className={cn(
                  'object-contain w-full h-full transition-all duration-300',
                  'group-hover:scale-[1.02]',
                  isUploading ? 'opacity-50' : 'opacity-100'
                )}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                unoptimized={preview.startsWith('blob:')}
                priority
              />

              {/* 上传中遮罩 */}
              {isUploading && (
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm'>
                  <Loader2 className='w-6 h-6 text-white animate-spin' />
                </div>
              )}
            </div>
          </div>

          {!disabled && (
            <div className='absolute top-2 right-2 flex gap-2'>
              <button
                type='button'
                onClick={handleRemoveImage}
                className='bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100'
                disabled={disabled || isUploading}
                aria-label='删除图片'
              >
                <X className='w-3 h-3' />
              </button>

              <button
                type='button'
                onClick={() =>
                  document.getElementById('single-image-upload')?.click()
                }
                className='bg-blue-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100'
                disabled={disabled || isUploading}
                aria-label='更换图片'
              >
                <Upload className='w-3 h-3' />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
