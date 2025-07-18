import { removeBackground } from "@imgly/background-removal";
import type { Config } from "@imgly/background-removal";
import { preload } from "@imgly/background-removal";

// 类型定义
export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: string;
}

// 质量选项
export type QualityLevel = 'low' | 'medium' | 'high';

export interface BackgroundRemovalOptions {
  onProgress?: (state: ProcessingState) => void;
  quality?: QualityLevel; // 添加质量选项
}

export class BackgroundRemovalTool {
  private isModelLoaded = false;
  private modelError: string | null = null;
  private isPreloading = false;

  constructor() {
    // 预加载模型以提高首次使用速度
    this.preloadModel();
  }

  // 预加载模型
  private async preloadModel(): Promise<void> {
    if (this.isPreloading) return;

    this.isPreloading = true;
    try {
      await preload();
      this.isModelLoaded = true;
    } catch (error) {
      console.error("模型预加载失败:", error);
      this.modelError = error instanceof Error ? error.message : "未知错误";
      this.isModelLoaded = false;
    } finally {
      this.isPreloading = false;
    }
  }

  // 获取模型状态
  public getModelStatus() {
    return {
      isLoaded: this.isModelLoaded,
      hasError: !!this.modelError,
      error: this.modelError,
    };
  }

  // 等待图片加载
  private waitForImageLoad(img: HTMLImageElement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        const handleLoad = () => {
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleError);
          resolve();
        };
        const handleError = () => {
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleError);
          reject(new Error("图片加载失败"));
        };
        img.addEventListener("load", handleLoad);
        img.addEventListener("error", handleError);
      }
    });
  }

  // 主要的背景移除方法
  public async removeBackground(
    imageElement: HTMLImageElement,
    options: BackgroundRemovalOptions = {},
  ): Promise<string> {
    const { onProgress, quality = 'medium' } = options;

    // 如果模型未加载完成，尝试加载
    if (!this.isModelLoaded && !this.isPreloading) {
      onProgress?.({ isProcessing: true, progress: 0, stage: "加载模型..." });
      await this.preloadModel();
    }

    if (this.modelError) {
      throw new Error(`模型加载失败: ${this.modelError}`);
    }

    onProgress?.({ isProcessing: true, progress: 10, stage: "准备处理..." });

    try {
      // 确保图片已加载
      await this.waitForImageLoad(imageElement);
      onProgress?.({ isProcessing: true, progress: 20, stage: "加载图片..." });

      // 根据质量选择不同的模型和配置
      let modelType;
      let outputQuality: number;
      
      switch (quality) {
        case 'low':
          modelType = 'isnet_fp16'; // 轻量级模型
          outputQuality = 0.7;
          break;
        case 'high':
          modelType = 'isnet'; // 高精度模型
          outputQuality = 0.9;
          break;
        case 'medium':
        default:
          modelType = 'isnet_fp16'; // 平衡模型
          outputQuality = 0.8;
          break;
      }

      // 配置选项
      const config: Config = {
        debug: false,
        progress: (key: string, current: number, total: number) => {
          const progressPercent = Math.round((current / total) * 60) + 20;
          const percentage = Math.round((current / total) * 100);
          
          let stageText = "处理中";
          if (percentage < 30) stageText = "AI 分析中";
          else if (percentage < 60) stageText = "处理轮廓";
          else if (percentage < 90) stageText = "精细处理";
          else stageText = "生成结果";
          
          onProgress?.({
            isProcessing: true,
            progress: progressPercent,
            stage: `${stageText} (${percentage}%)`,
          });
        },
        output: {
          format: "image/png",
          quality: outputQuality,
        },
        model: modelType
      };

      onProgress?.({ isProcessing: true, progress: 30, stage: "AI 分析中..." });

      // 将 HTMLImageElement 转换为 ImageSource 支持的类型
      const imageSource = imageElement.src;
      
      // 执行背景移除
      const blob = await removeBackground(imageSource, config);

      onProgress?.({ isProcessing: true, progress: 90, stage: "生成结果..." });

      // 转换为 data URL
      const dataUrl = URL.createObjectURL(blob);

      onProgress?.({ isProcessing: true, progress: 95, stage: "完成" });

      return dataUrl;
    } catch (error) {
      console.error("背景移除失败:", error);
      throw error;
    } finally {
      onProgress?.({ isProcessing: false, progress: 0, stage: "" });
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
    link.download = filename || `background-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 创建单例实例
export const backgroundRemovalTool = new BackgroundRemovalTool();
