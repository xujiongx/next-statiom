import { ProcessingState } from "../background-removal/backgroundRemoval";

export interface EraserOptions {
  size: number;
  color?: string;
  onProgress?: (state: ProcessingState) => void;
}

export class EraserTool {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isErasing: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  private options: EraserOptions;

  constructor(canvas: HTMLCanvasElement, options: EraserOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("无法创建 canvas 上下文");
    }
    this.ctx = ctx;
    this.options = options;
  }

  // 初始化橡皮擦工具
  public init(imageDataUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // 设置canvas尺寸与图片一致
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        // 绘制图片到canvas
        this.ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve();
      };
      img.onerror = () => {
        reject(new Error("图片加载失败"));
      };
      img.src = imageDataUrl;
    });
  }

  // 开始擦除
  public startErasing(x: number, y: number): void {
    this.isErasing = true;
    this.lastX = x;
    this.lastY = y;
  }

  // 擦除过程
  public erase(x: number, y: number): void {
    if (!this.isErasing) return;

    this.ctx.beginPath();
    this.ctx.globalCompositeOperation = "destination-out"; // 关键属性：使绘制的内容擦除已有内容
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    this.ctx.lineWidth = this.options.size;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
  }

  // 停止擦除
  public stopErasing(): void {
    this.isErasing = false;
  }

  // 获取处理后的图像
  public getProcessedImage(): string {
    return this.canvas.toDataURL("image/png");
  }

  // 重置橡皮擦工具
  public reset(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 调整橡皮擦大小
  public setSize(size: number): void {
    this.options.size = size;
  }
}