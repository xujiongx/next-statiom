export interface User {
  id: number;
  username: string;
  nickname?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}