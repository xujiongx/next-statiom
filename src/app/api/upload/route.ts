import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';

// ImgBB API密钥 - 建议使用环境变量存储
const IMG_BB_API_KEY = process.env.IMG_BB_API_KEY || '您的ImgBB API密钥';

export const POST = (request: NextRequest) => {
  return withErrorHandler(async () => {
    try {
      // 获取上传的文件
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          {
            code: 400,
            message: '没有找到文件',
          },
          { status: 400 }
        );
      }
      
      // 将文件转换为base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');
      
      // 准备发送到ImgBB的数据
      const imgbbFormData = new FormData();
      imgbbFormData.append('key', IMG_BB_API_KEY);
      imgbbFormData.append('image', base64Image);
      
      // 发送请求到ImgBB API，增加超时设置和重试逻辑
      const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, timeout = 30000) => {
        // 创建带超时的AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const updatedOptions = {
          ...options,
          signal: controller.signal,
        };
        
        try {
          const response = await fetch(url, updatedOptions);
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          if (retries <= 1) throw error;
          
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchWithRetry(url, options, retries - 1, timeout);
        }
      };
      
      // 使用重试函数发送请求
      const response = await fetchWithRetry('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
        method: 'POST',
        body: imgbbFormData,
      }, 3, 60000); // 3次重试，60秒超时
      
      if (!response.ok) {
        throw new Error(`上传失败: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // 返回上传结果
      return NextResponse.json({
        code: 0,
        data: {
          url: result.data.url,
          display_url: result.data.display_url,
          delete_url: result.data.delete_url,
          filename: result.data.title,
          size: result.data.size,
          time: result.data.time,
          expiration: result.data.expiration,
        },
      });
    } catch (error) {
      console.error('上传图片失败:', error);
      return NextResponse.json(
        {
          code: 500,
          message: '上传图片失败',
        },
        { status: 500 }
      );
    }
  });
};