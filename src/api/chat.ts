import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface SendMessageParams {
  content: string;
  sessionId: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export const chatApi = {
  // 发送消息
  sendMessage: (params: SendMessageParams): Promise<ApiResponse<string>> => {
    return http.get('/mistral/chat', { params });
  },

  // 获取历史消息
  getHistory: (sessionId: string): Promise<ApiResponse<ChatHistory>> => {
    return http.get(`/mistral/conversations/${sessionId}`);
  },

  // 获取会话列表
  getConversations: (): Promise<
    ApiResponse<{
      conversations: Array<{
        id: string;
        session_id: string;
        title: string;
        updated_at: string;
      }>;
    }>
  > => {
    return http.get('/mistral/conversations');
  },

  // 删除会话
  deleteConversation: (sessionId: string): Promise<ApiResponse<void>> => {
    return http.delete(`/mistral/conversations/${sessionId}`);
  },
  getLatestConversation: (): Promise<
    ApiResponse<{
      id: string;
      session_id: string;
      title: string;
      updated_at: string;
    }>
  > => {
    return http.get('/mistral/conversations/latest');
  },
};
