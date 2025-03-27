import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api';

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

export const translateApi = {
  translate: (params: TranslateParams): Promise<ApiResponse<TranslateResult>> => {
    return http.post('/translate', params);
  },
};