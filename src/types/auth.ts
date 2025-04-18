export interface User {
  id: string;
  username: string;
  nickname?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}