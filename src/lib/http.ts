import axios from 'axios';

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 处理 401 未授权
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // 统一错误格式
    return Promise.reject({
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || '网络错误',
      data: error.response?.data,
    });
  }
);
