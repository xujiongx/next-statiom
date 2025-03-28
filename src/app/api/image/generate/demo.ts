import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
// import OpenAI from 'openai';
// import { HttpsProxyAgent } from 'https-proxy-agent';

// // 创建代理实例
// const getProxyAgent = () => {
//   if (process.env.HTTPS_PROXY) {
//     return new HttpsProxyAgent(process.env.HTTPS_PROXY);
//   }
//   return undefined;
// };

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   timeout: 60000, // 增加超时时间
//   baseURL: 'https://api.openai.com/v1', // 明确指定 API 地址
//   httpAgent: getProxyAgent(), // 使用 httpAgent 属性设置代理
// });

export const POST = (request: Request) => {
  return withErrorHandler(async () => {
    try {
      const body = await request.json();
      const { prompt } = body;

      if (!prompt) {
        return NextResponse.json(
          { code: 400, message: '缺少必要参数' },
          { status: 400 }
        );
      }

      // 使用模拟数据进行测试
      // const response = await openai.images.generate({
      //   model: 'dall-e-3',
      //   prompt,
      //   n: 1,
      //   size: '1024x1024',
      //   quality: 'standard',
      // });

      // 模拟响应数据
      return NextResponse.json({
        code: 0,
        data: {
          url: `https://placehold.co/1024x1024/EEE/31343C?text=${encodeURIComponent(prompt.substring(0, 20))}`,
        },
      });
    } catch (error: unknown) {
      // 修复类型问题：正确处理 unknown 类型的错误
      const errorMessage = error instanceof Error ? error.message : '图片生成失败，请稍后重试';
      console.error('Image generation error:', error);
      
      return NextResponse.json(
        {
          code: 500,
          message: errorMessage,
        },
        { status: 500 }
      );
    }
  });
};