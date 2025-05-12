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
      
      // 发送请求到ImgBB API
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgbbFormData,
      });
      
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