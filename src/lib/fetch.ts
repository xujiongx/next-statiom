import fetch, { RequestInit, Response } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent } from 'http';

// 定义请求选项的接口
interface FetchOptions extends Omit<RequestInit, 'agent'> {
  agent?: Agent;
  timeout?: number;
}

export const fetchWithRetry = async (
  url: string,
  options: FetchOptions,
  retries = 3
): Promise<Response> => {
  const proxyAgent =
    process.env.NODE_ENV === 'development' && process.env.HTTPS_PROXY
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
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      throw new Error(`API 请求失败: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('所有重试都失败了');
};
