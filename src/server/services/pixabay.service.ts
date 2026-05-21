import { fetchWithRetry } from '@/lib/fetch';
import { prisma } from '@/lib/db';

interface PixabayImage {
  id: number;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  user: string;
  views: number;
  downloads: number;
  pageURL: string;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export interface ImageType {
  id: string;
  url: string;
  created_at: Date;
}

export class PixabayService {
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey) {
      throw new Error('Pixabay API key not found in environment variables');
    }
    this.apiKey = apiKey;
  }

  async getRandomImages(
    count: number = 3,
    category: string = 'nature',
  ): Promise<PixabayImage[]> {
    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const pixabayUrl = `https://pixabay.com/api/?key=${
        this.apiKey
      }&image_type=photo&per_page=${count}&page=${randomPage}&category=${category}&q=${encodeURIComponent(
        '壁纸',
      )}&safesearch=true`;

      console.log('正在从 Pixabay 拉取随机图片...');
      console.log('请求URL:', pixabayUrl.replace(this.apiKey, '***API_KEY***'));

      const response = await fetchWithRetry(pixabayUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PixabayBot/1.0)',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 错误详情:', errorText);
        throw new Error(
          `Pixabay API 请求失败: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as PixabayResponse;

      if (data.hits && data.hits.length > 0) {
        console.log(`成功获取 ${data.hits.length} 张图片`);
        return data.hits.slice(0, count);
      }

      console.log('未获取到任何图片');
      return [];
    } catch (error) {
      console.error('从 Pixabay 拉取图片时发生错误:', error);
      throw error;
    }
  }

  async saveImagesToDatabase(images: PixabayImage[]): Promise<void> {
    try {
      console.log(`开始保存 ${images.length} 张图片到数据库...`);

      for (const image of images) {
        try {
          const existingImage = await prisma.image.findUnique({
            where: { url: image.largeImageURL },
            select: { id: true },
          });

          if (existingImage) {
            console.log(`图片 URL ${image.largeImageURL} 已存在，跳过保存`);
            continue;
          }

          await prisma.image.create({
            data: { url: image.largeImageURL },
          });

          console.log(`成功保存图片: ${image.largeImageURL}`);
        } catch (imageError) {
          console.error(
            `保存图片 ${image.largeImageURL} 时发生错误:`,
            imageError,
          );
        }
      }

      console.log('图片保存完成');
    } catch (error) {
      console.error('保存图片到数据库时发生错误:', error);
      throw error;
    }
  }

  logImageInfo(images: PixabayImage[]): void {
    images.forEach((image, index) => {
      console.log(`图片 ${index + 1}: ${image.largeImageURL}`);
    });
  }

  async syncData(count: number = 2): Promise<void> {
    console.log('数据同步任务...');

    try {
      const images = await this.getRandomImages(count);

      if (images.length > 0) {
        this.logImageInfo(images);
        await this.saveImagesToDatabase(images);
        console.log(`数据同步完成，成功处理 ${images.length} 张图片`);
      } else {
        console.log('未获取到任何图片');
      }
    } catch (error) {
      console.error('数据同步任务执行失败:', error);
    }
  }

  async getImagesFromDatabase(
    limit: number = 10,
    offset: number = 0,
  ): Promise<ImageType[]> {
    try {
      const images = await prisma.image.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          url: true,
          createdAt: true,
        },
      });

      return images.map((image) => ({
        id: image.id,
        url: image.url,
        created_at: image.createdAt,
      }));
    } catch (error) {
      console.error('从数据库获取图片时发生错误:', error);
      throw error;
    }
  }
}
