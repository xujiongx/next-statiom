import { v4 as uuidv4 } from 'uuid';
import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface ChatParams {
  content: string;
  sessionId?: string;
  model?: string;
}

export const openRouterApi = {
  /**
   * 发送消息到OpenRouter API
   * @param params 请求参数
   * @returns 返回AI助手的回复内容
   */
  sendMessage: (params: ChatParams): Promise<ApiResponse<string>> => {
    const { content, sessionId = uuidv4(), model = 'deepseek/deepseek-chat:free' } = params;

    return http.post('/openrouter', {
      content,
      sessionId,
      model,
    });
  },
};