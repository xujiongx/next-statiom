import { create } from 'zustand';
import {
  DEFAULT_POSTER_DATA,
  POSTER_TEMPLATES,
} from '@/app/subpackages/image/poster/constants';
import {
  PosterData,
  PosterTemplate,
  UpdateValue,
} from '@/app/subpackages/image/poster/types';

interface PosterState {
  // 状态
  posterData: PosterData;
  currentTemplate: PosterTemplate;
  posterImage: string | null;
  loading: boolean;

  // 操作
  updatePosterData: (field: keyof PosterData, value: UpdateValue) => void;
  generatePoster: (
    canvasRef: React.RefObject<HTMLDivElement | null>
  ) => Promise<string>;
  downloadPoster: () => void;
  resetPosterData: () => void;
}

export const usePosterStore = create<PosterState>((set, get) => ({
  // 初始状态
  posterData: DEFAULT_POSTER_DATA,
  currentTemplate: POSTER_TEMPLATES[0],
  posterImage: null,
  loading: false,

  // 更新海报数据
  updatePosterData: (field, value) => {
    set((state) => {
      const newPosterData = { ...state.posterData, [field]: value };

      // 更新当前模板
      const currentTemplate =
        POSTER_TEMPLATES.find(
          (template) => template.id === newPosterData.template
        ) || POSTER_TEMPLATES[0];

      return {
        posterData: newPosterData,
        currentTemplate,
      };
    });
  },

  // 重置海报数据
  resetPosterData: () => {
    set({
      posterData: DEFAULT_POSTER_DATA,
      currentTemplate: POSTER_TEMPLATES[0],
      posterImage: null,
    });
  },

  // 生成海报
  generatePoster: async (canvasRef) => {
    set({ loading: true });

    try {
      if (!canvasRef.current) {
        throw new Error('Canvas reference is not available');
      }

      // 导入 html2canvas (动态导入以减少初始加载时间)
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const posterImage = canvas.toDataURL('image/png');
      set({ posterImage, loading: false });

      return posterImage;
    } catch (error) {
      console.error('生成海报失败:', error);
      set({ loading: false });
      throw error;
    }
  },

  // 下载海报
  downloadPoster: () => {
    const { posterImage } = get();

    if (!posterImage) return;

    const link = document.createElement('a');
    link.download = `poster-${Date.now()}.png`;
    link.href = posterImage;
    link.click();
  },
}));

// 将 store 添加到 index.ts 导出
