import { http } from '@/lib/http';

export interface LoginParams {
  username: string;
  password: string;
}

export interface UserInfo {
  id?: string;
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

export interface SessionResponse {
  user: UserInfo | null;
  expires: string;
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

  register: (
    params: UserInfo
  ): Promise<
    ApiResponse<{
      token: string;
      user: UserInfo;
    }>
  > => {
    return http.post('/auth/register', params);
  },

  getCurrentUser: (): Promise<ApiResponse<UserInfo>> => {
    return http.get('/auth/user/me');
  },
  
  // 新增获取会话信息接口
  getSession: (): Promise<ApiResponse<SessionResponse>> => {
    return http.get('/auth/session');
  },
};
