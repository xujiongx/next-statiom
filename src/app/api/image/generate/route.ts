import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import fetch, { RequestInit, Response } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent } from 'http';
import { Mistral, SDKOptions } from '@mistralai/mistralai';
import { config } from '@/config';

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY as SDKOptions);

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

// 添加响应数据的接口定义
interface ApiResponse {
  code: number;
  data?: {
    url: string;
    prompt: string;
    translatedPrompt: string;
  };
  message?: string;
}

// 添加请求体的接口定义
interface RequestBody {
  prompt: string;
}

export const POST = (request: Request) => {
  return withErrorHandler(async () => {
    try {
      const body = await request.json() as RequestBody;
      const { prompt } = body;

      if (!prompt) {
        return NextResponse.json(
          { code: 400, message: '缺少必要参数' },
          { status: 400 }
        );
      }

      // 使用 Mistral 进行翻译
      const translatePrompt = `请将以下中文文本翻译成英文，翻译时要考虑图像生成的上下文，只返回翻译结果：\n\n${prompt}`;
      const translateResponse = await mistralClient.chat.complete({
        model: config.mistral.model,
        messages: [{ role: 'user', content: translatePrompt }],
        stream: false,
      });

      const englishPrompt = translateResponse.choices?.[0].message.content || prompt;

      // 使用翻译后的英文提示词生成图片
      const response = await fetchWithRetry(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN || "hf_dummy_token"}`,
          },
          body: JSON.stringify({ inputs: englishPrompt }),
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
          prompt,
          translatedPrompt: englishPrompt,
        },
      } as ApiResponse);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '图片生成失败，请稍后重试';
      console.error('Image generation error:', error);
      
      return NextResponse.json({
        code: 500,
        message: errorMessage,
      } as ApiResponse);
    }
  });
};