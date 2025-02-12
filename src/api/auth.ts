import { http } from '@/lib/http';

export interface LoginParams {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

export const authApi = {
  login: (params: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    return http.post('/auth/login', params);
  },
  
  logout: (): Promise<ApiResponse<null>> => {
    return http.post('/auth/logout');
  },
  
  getUserInfo: (): Promise<ApiResponse<UserInfo>> => {
    return http.get('/auth/user/info');
  },

  register: (params: {
    username: string;
    password: string;
    nickname: string;
  }) => {
    return http.post<{
      token: string;
      user: {
        id: number;
        username: string;
        nickname: string;
      };
    }>('/auth/register', params);
  },
};