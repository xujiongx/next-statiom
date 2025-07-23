import { removeBackground } from "@imgly/background-removal";
import type { Config } from "@imgly/background-removal";
import { PixelCrop } from "react-image-crop";
import { ProcessingState } from "../background-removal/backgroundRemoval";

export class SelectionRemovalTool {
  // 移除选定区域的背景
  public static async removeSelectedBackground(
    imageElement: HTMLImageElement,
    crop: PixelCrop,
    onProgress?: (state: ProcessingState) => void
  ): Promise<string> {
    onProgress?.({ isProcessing: true, progress: 10, stage: "准备处理..." });

    try {
      // 创建 canvas 元素用于裁剪
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("无法创建 canvas 上下文");
      }

      onProgress?.({ isProcessing: true, progress: 20, stage: "裁剪选区..." });

      // 计算缩放比例
      const scaleX = imageElement.naturalWidth / imageElement.width;
      const scaleY = imageElement.naturalHeight / imageElement.height;

      // 设置 canvas 尺寸为裁剪区域实际大小
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      // 绘制裁剪后的图像
      ctx.drawImage(
        imageElement,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      onProgress?.({ isProcessing: true, progress: 40, stage: "AI 分析中..." });

      // 配置选项
      const config: Config = {
        debug: false,
        progress: (key: string, current: number, total: number) => {
          const progressPercent = Math.round((current / total) * 40) + 40;
          const percentage = Math.round((current / total) * 100);

          let stageText = "处理中";
          if (percentage < 30) stageText = "AI 分析中";
          else if (percentage < 60) stageText = "处理轮廓";
          else if (percentage < 90) stageText = "精细处理";
          else stageText = "生成结果";

          onProgress?.({
            isProcessing: true,
            progress: progressPercent,
            stage: `${stageText} (${percentage}%)`
          });
        },
        output: {
          format: "image/png",
          quality: 0.8
        },
        model: "isnet_fp16"
      };

      // 将裁剪后的图像转换为 data URL
      const croppedDataUrl = canvas.toDataURL("image/png");

      // 对裁剪后的图像执行背景移除
      const blob = await removeBackground(croppedDataUrl, config);

      onProgress?.({ isProcessing: true, progress: 90, stage: "生成结果..." });

      // 转换为 data URL
      const dataUrl = URL.createObjectURL(blob);

      onProgress?.({ isProcessing: true, progress: 100, stage: "完成" });
      setTimeout(() => {
        onProgress?.({ isProcessing: false, progress: 0, stage: "" });
      }, 500);

      return dataUrl;
    } catch (error) {
      console.error("框选抠图失败:", error);
      throw error;
    }
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
    link.download = filename || `selection-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 居中裁剪区域
  public static centerCrop(mediaWidth: number, mediaHeight: number): PixelCrop {
    const size = Math.min(mediaWidth, mediaHeight) * 0.8;
    
    return {
      unit: 'px',
      x: (mediaWidth - size) / 2,
      y: (mediaHeight - size) / 2,
      width: size,
      height: size
    };
  }
}