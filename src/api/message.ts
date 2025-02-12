import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

export interface Message {
  id: string;
  title: string;
  updated_at: string;
}

export const messageApi = {
  getMessages: (): Promise<ApiResponse<Message[]>> => {
    return http.get('/message');
  },
};
