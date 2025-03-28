import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import fetch, { RequestInit, Response } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent } from 'http';

// 定义请求选项的接口
interface FetchOptions extends Omit<RequestInit, 'agent'> {
  agent?: Agent;
  timeout?: number;
}

const fetchWithRetry = async (
  url: string, 
  options: FetchOptions, 
  retries = 3
): Promise<Response> => {
  const proxyAgent = process.env.NODE_ENV === 'development' && process.env.HTTPS_PROXY 
    ? new HttpsProxyAgent(process.env.HTTPS_PROXY)
    : undefined;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        agent: proxyAgent,
        timeout: 30000,
      } as RequestInit);
      
      if (response.ok) return response;
      
      // 如果是 429 (Too Many Requests)，等待后重试
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`API 请求失败: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('所有重试都失败了');
};

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

      const response = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN || "hf_dummy_token"}`,
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.statusText}`);
      }

      // 获取图片数据
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      return NextResponse.json({
        code: 0,
        data: {
          url: dataUrl,
        },
      });
    } catch (error: unknown) {
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