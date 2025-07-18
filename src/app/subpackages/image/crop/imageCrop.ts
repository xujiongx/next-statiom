import { ProcessingState } from "../background-removal/backgroundRemoval";
import { PixelCrop } from "react-image-crop";

export interface CropOptions {
  crop: PixelCrop;
  onProgress?: (state: ProcessingState) => void;
}

export class ImageCropTool {
  // 裁剪图片
  public static async cropImage(
    imageElement: HTMLImageElement,
    options: CropOptions
  ): Promise<string> {
    const { crop, onProgress } = options;
    
    onProgress?.({ isProcessing: true, progress: 10, stage: "准备处理..." });
    
    return new Promise((resolve, reject) => {
      try {
        // 创建 canvas 元素
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("无法创建 canvas 上下文"));
          return;
        }
        
        onProgress?.({ isProcessing: true, progress: 30, stage: "裁剪图片中..." });
        
        // 计算缩放比例
        const scaleX = imageElement.naturalWidth / imageElement.width;
        const scaleY = imageElement.naturalHeight / imageElement.height;
        
        // 设置 canvas 尺寸为裁剪区域实际大小
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
        
        // 绘制裁剪后的图像，考虑缩放比例
        ctx.drawImage(
          imageElement, 
          crop.x * scaleX, crop.y * scaleY, 
          crop.width * scaleX, crop.height * scaleY, // 源图像的裁剪区域（考虑缩放）
          0, 0, 
          crop.width * scaleX, crop.height * scaleY  // 目标canvas的绘制区域
        );
        
        onProgress?.({ isProcessing: true, progress: 80, stage: "生成结果..." });
        
        // 转换为 data URL
        const dataUrl = canvas.toDataURL("image/png");
        
        onProgress?.({ isProcessing: true, progress: 100, stage: "完成" });
        setTimeout(() => {
          onProgress?.({ isProcessing: false, progress: 0, stage: "" });
        }, 500);
        
        resolve(dataUrl);
      } catch (error) {
        console.error("图片裁剪失败:", error);
        reject(error);
      }
    });
  }
  
  // 文件验证
  public static validateFile(file: File): string | null {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return "请选择有效的图片文件（JPG、PNG、WEBP）";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "图片大小不能超过 10MB";
    }
    return null;
  }

  // 下载处理后的图片
  public static downloadImage(dataUrl: string, filename?: string): void {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename || `cropped-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 居中裁剪区域
  public static centerCrop(mediaWidth: number, mediaHeight: number, aspect?: number): PixelCrop {
    const width = aspect ? Math.min(mediaWidth, mediaHeight * aspect) : mediaWidth * 0.8;
    const height = aspect ? width / aspect : mediaHeight * 0.8;
    
    return {
      unit: 'px',
      x: (mediaWidth - width) / 2,
      y: (mediaHeight - height) / 2,
      width,
      height
    };
  }
}