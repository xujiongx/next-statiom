import { fetchWithRetry } from "@/lib/fetch";
import { client } from "@/lib/db";

// Pixabay API 响应类型定义
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
      throw new Error("Pixabay API key not found in environment variables");
    }
    this.apiKey = apiKey;
  }

  /**
   * 从 Pixabay 获取随机图片
   * @param count 要获取的图片数量，默认为 2
   * @param category 图片分类，默认为 'nature'
   * @returns Promise<PixabayImage[]>
   */
  async getRandomImages(
    count: number = 3,
    category: string = "nature",
  ): Promise<PixabayImage[]> {
    try {
      // 生成随机页码以获取更随机的图片
      const randomPage = Math.floor(Math.random() * 10) + 1;

      // 构建 Pixabay API URL
      const pixabayUrl = `https://pixabay.com/api/?key=${
        this.apiKey
      }&image_type=photo&per_page=${count}&page=${randomPage}&category=${category}&q=${encodeURIComponent(
        "壁纸",
      )}&safesearch=true`;

      console.log("👮‍♀️", pixabayUrl);

      console.log("正在从 Pixabay 拉取随机图片...");
      console.log("请求URL:", pixabayUrl.replace(this.apiKey, "***API_KEY***")); // 隐藏API key

      const response = await fetchWithRetry(pixabayUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PixabayBot/1.0)",
        },
      });

      console.log("响应状态:", response.status, response.statusText);

      if (!response.ok) {
        // 获取详细的错误信息
        const errorText = await response.text();
        console.error("API 错误详情:", errorText);
        throw new Error(
          `Pixabay API 请求失败: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as PixabayResponse;

      console.log("API 响应数据:", {
        total: data.total,
        totalHits: data.totalHits,
        hitsCount: data.hits?.length || 0,
      });

      if (data.hits && data.hits.length > 0) {
        console.log(`成功获取 ${data.hits.length} 张图片`);
        return data.hits.slice(0, count); // 确保返回指定数量的图片
      } else {
        console.log("未获取到任何图片");
        return [];
      }
    } catch (error) {
      console.error("从 Pixabay 拉取图片时发生错误:", error);

      // 提供更详细的错误信息和解决建议
      if (error instanceof Error) {
        if (error.message.includes("Bad Request")) {
          console.error("可能的解决方案：");
          console.error("1. 检查 PIXABAY_API_KEY 是否正确设置");
          console.error("2. 确认 API key 是否有效且未过期");
          console.error("3. 检查网络连接");
          console.error("4. 验证 API 请求参数是否正确");
        }
      }

      throw error; // 重新抛出错误，让调用者处理
    }
  }

  /**
   * 将图片信息保存到数据库
   * @param images 图片数组
   * @returns Promise<void>
   */
  async saveImagesToDatabase(images: PixabayImage[]): Promise<void> {
    try {
      console.log(`开始保存 ${images.length} 张图片到数据库...`);

      for (const image of images) {
        try {
          // 检查图片URL是否已存在 - 使用 query 而不是 querySingle
          const existingImages = await client.query(
            `
            SELECT Image {
              id,
              url
            }
            FILTER .url = <str>$url
          `,
            {
              url: image.largeImageURL,
            },
          );

          if (existingImages.length > 0) {
            console.log(`图片 URL ${image.largeImageURL} 已存在，跳过保存`);
            continue;
          }

          // 插入新图片
          await client.querySingle(
            `
            INSERT Image {
              url := <str>$url
            }
          `,
            {
              url: image.largeImageURL,
            },
          );

          console.log(`成功保存图片: ${image.largeImageURL}`);
        } catch (imageError) {
          console.error(
            `保存图片 ${image.largeImageURL} 时发生错误:`,
            imageError,
          );
          // 继续处理下一张图片，不中断整个流程
        }
      }

      console.log("图片保存完成");
    } catch (error) {
      console.error("保存图片到数据库时发生错误:", error);
      throw error;
    }
  }

  /**
   * 打印图片信息到控制台
   * @param images 图片数组
   */
  logImageInfo(images: PixabayImage[]): void {
    images.forEach((image, index) => {
      console.log(`图片 ${index + 1}: ${image.largeImageURL}`);
    });
  }

  /**
   * 执行数据同步任务
   * @param count 要同步的图片数量，默认为 2
   */
  async syncData(count: number = 2): Promise<void> {
    console.log("数据同步任务...");

    try {
      const images = await this.getRandomImages(count);

      if (images.length > 0) {
        this.logImageInfo(images);

        // 将图片信息保存到数据库
        await this.saveImagesToDatabase(images);

        console.log(`数据同步完成，成功处理 ${images.length} 张图片`);
      } else {
        console.log("未获取到任何图片");
        console.log("可能的原因：");
        console.log("1. API key 无效");
        console.log("2. 请求参数不正确");
        console.log("3. 网络连接问题");
      }
    } catch (error) {
      console.error("数据同步任务执行失败:", error);
      // 这里可以添加错误通知或重试逻辑
    }
  }

  /**
   * 获取数据库中的图片列表
   * @param limit 限制返回数量
   * @param offset 偏移量
   * @returns Promise<any[]>
   */
  async getImagesFromDatabase(
    limit: number = 10,
    offset: number = 0,
  ): Promise<ImageType[]> {
    try {
      const images: ImageType[] = await client.query(
        `
        SELECT Image {
          id,
          url,
          created_at
        }
        ORDER BY .created_at DESC
        OFFSET <int64>$offset
        LIMIT <int64>$limit
      `,
        {
          limit,
          offset,
        },
      );

      return images;
    } catch (error) {
      console.error("从数据库获取图片时发生错误:", error);
      throw error;
    }
  }
}
