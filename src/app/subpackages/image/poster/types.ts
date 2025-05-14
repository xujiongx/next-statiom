// 海报模板类型
export interface PosterTemplate {
  id: string;
  name: string;
  bgColor: string;
}

// 字体选项类型
export interface FontOption {
  value: string;
  label: string;
}

// 文本位置类型
export interface TextPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  isResizing: boolean;
}

// 海报数据类型
export interface TextElement {
  id: string;
  content: string;
  color: string;
  font: string;
  size: number;
  position: TextPosition;
}

// 图片元素类型
export interface ImageElement {
  id: string;
  url: string;
  position: TextPosition; // 复用 TextPosition 类型
  width: number;
  height: number;
  opacity: number;
  borderRadius: number;
}

// 修改 PosterData 接口
export interface PosterData {
  template: string;
  title: string;
  subtitle: string;
  description: string;
  titleColor: string;
  subtitleColor: string;
  descriptionColor: string;
  titleFont: string;
  subtitleFont: string;
  descriptionFont: string;
  titleSize: number;
  subtitleSize: number;
  descriptionSize: number;
  imageUrl: string;

  // 新增样式配置
  imageOpacity: number; // 背景图片透明度
  borderRadius: number; // 圆角大小
  enableShadow: boolean; // 是否启用卡片阴影
  enableTextShadow: boolean; // 是否启用文字阴影
  textAlign: 'left' | 'center' | 'right'; // 文本对齐方式
  backgroundStyle: string; // 背景样式类型
  backgroundColor: string; // 背景颜色

  // 文本位置
  titlePosition: TextPosition;
  subtitlePosition: TextPosition;
  descriptionPosition: TextPosition;

  // 是否启用拖拽功能
  enableDrag: boolean;

  // 添加自定义文本元素数组
  customTexts: TextElement[];
  customImages: ImageElement[];
}

// 从单图片上传组件导入的类型
export interface UploadedImage {
  url: string;
  display_url: string;
  filename: string;
  size?: number;
}

export type UpdateValue =
  | string
  | number
  | boolean
  | null
  | TextPosition
  | TextElement[]
  | ImageElement[];
