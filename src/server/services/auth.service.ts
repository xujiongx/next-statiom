import { LoginParams } from '@/types/auth';
import { ApiError } from '@/lib/error';

export class AuthService {
  async login(params: LoginParams) {
    const { username, password } = params;

    if (username === 'admin' && password === '123456') {
      return {
        token: 'mock-token',
        user: {
          id: 1,
          username: 'admin',
          nickname: '管理员'
        }
      };
    }

    throw new ApiError('用户名或密码错误', 401);
  }
}

export const authService = new AuthService();