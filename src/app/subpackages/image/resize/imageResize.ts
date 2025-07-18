import { ProcessingState } from "../background-removal/backgroundRemoval";

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  onProgress?: (state: ProcessingState) => void;
}

export class ImageResizeTool {
  // 调整图片尺寸
  public static async resizeImage(
    imageElement: HTMLImageElement,
    options: ResizeOptions
  ): Promise<string> {
    const { width, height, maintainAspectRatio, onProgress } = options;
    
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
        
        onProgress?.({ isProcessing: true, progress: 30, stage: "调整尺寸中..." });
        
        // 设置 canvas 尺寸
        let targetWidth = width;
        let targetHeight = height;
        
        // 如果需要保持宽高比
        if (maintainAspectRatio) {
          const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
          
          if (width && !height) {
            // 只设置宽度，按比例计算高度
            targetHeight = Math.round(width / aspectRatio);
          } else if (height && !width) {
            // 只设置高度，按比例计算宽度
            targetWidth = Math.round(height * aspectRatio);
          } else {
            // 宽高都设置，以宽度为准
            targetHeight = Math.round(width / aspectRatio);
          }
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // 绘制调整后的图像
        ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);
        
        onProgress?.({ isProcessing: true, progress: 80, stage: "生成结果..." });
        
        // 转换为 data URL
        const dataUrl = canvas.toDataURL("image/png");
        
        onProgress?.({ isProcessing: true, progress: 100, stage: "完成" });
        setTimeout(() => {
          onProgress?.({ isProcessing: false, progress: 0, stage: "" });
        }, 500);
        
        resolve(dataUrl);
      } catch (error) {
        console.error("图片尺寸调整失败:", error);
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
    link.download = filename || `resized-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}