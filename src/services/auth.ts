import http from './http';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    nickname?: string;
  };
}

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  return http.post('/login', params);
};

export const logout = async () => {
  return http.post('/logout');
};

export const getUserInfo = async () => {
  return http.get('/user/info');
};
