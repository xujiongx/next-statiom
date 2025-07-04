import { ApiResponse } from '@/types/api';
import { http } from '@/lib/http';

export interface TranslateParams {
  text: string;
  from: string;
  to: string;
}

export interface TranslateResult {
  text: string;
  from: string;
  to: string;
  result: string;
}

// 新增Q&A相关类型定义
export interface QAParams {
  prompt: string;
  model?: string;
}

export interface QAResult {
  response: string;
  model: string;
  timestamp: string;
}

export const translateApi = {
  translate: (params: TranslateParams): Promise<ApiResponse<TranslateResult>> => {
    return http.post('/translate', params);
  },
};

// 新增Q&A API请求函数
export const qaApi = {
  /**
   * 发送问题到Q&A API
   * @param params 请求参数
   * @returns 返回AI的回答内容
   */
  ask: (params: QAParams): Promise<ApiResponse<QAResult>> => {
    return http.post('/qa', params);
  },
  
  /**
   * 获取Q&A接口信息
   * @returns 返回接口基本信息
   */
  getInfo: (): Promise<ApiResponse<{ name: string; description: string; version: string }>> => {
    return http.get('/qa');
  },
};