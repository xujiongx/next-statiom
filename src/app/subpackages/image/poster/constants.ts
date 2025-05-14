import { PosterTemplate, FontOption, PosterData } from './types';

// 海报模板配置
export const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'template1',
    name: '商业简约',
    bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
  },
  {
    id: 'template2',
    name: '时尚潮流',
    bgColor: 'bg-gradient-to-r from-pink-500 to-orange-500',
  },
  {
    id: 'template3',
    name: '自然清新',
    bgColor: 'bg-gradient-to-br from-green-400 to-blue-400',
  },
  {
    id: 'template4',
    name: '科技未来',
    bgColor: 'bg-gradient-to-br from-indigo-600 to-purple-800',
  },
  {
    id: 'template5',
    name: '节日喜庆',
    bgColor: 'bg-gradient-to-r from-red-500 to-yellow-500',
  },
];

// 字体选项配置
export const FONT_OPTIONS: FontOption[] = [
  { value: 'sans', label: '无衬线体' },
  { value: 'serif', label: '衬线体' },
  { value: 'mono', label: '等宽体' },
];

// 默认海报数据
export const DEFAULT_POSTER_DATA: PosterData = {
  template: 'template1',
  title: '精彩活动即将开始',
  subtitle: '不容错过的年度盛会',
  description: '2023年12月15日 | 上海国际会展中心',
  titleColor: '#ffffff',
  subtitleColor: '#f0f0f0',
  descriptionColor: '#e0e0e0',
  titleFont: 'sans',
  subtitleFont: 'sans',
  descriptionFont: 'sans',
  titleSize: 36,
  subtitleSize: 24,
  descriptionSize: 16,
  imageUrl: '',
  customTexts: [],
  customImages: [],
  imageOpacity: 20,
  borderRadius: 8,
  enableShadow: true,
  enableTextShadow: false,
  textAlign: 'center',
  backgroundStyle: 'gradient',
  backgroundColor: '#ffffff',
  
  // 文本位置默认值
  titlePosition: {
    x: 50,
    y: 30,
    width: 80,
    height: 20, // 添加默认高度
    isDragging: false,
    isResizing: false
  },
  subtitlePosition: {
    x: 50,
    y: 45,
    width: 70,
    height: 15, // 添加默认高度
    isDragging: false,
    isResizing: false
  },
  descriptionPosition: {
    x: 50,
    y: 70,
    width: 60,
    height: 25, // 添加默认高度
    isDragging: false,
    isResizing: false
  },
  enableDrag: true
};