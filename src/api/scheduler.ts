import { http } from '@/lib/http';
import { ApiResponse } from '@/types/api'


interface CreateTaskParams {
  name: string;
  cronExpression: string;
  handler: string;
  isActive?: boolean;
}

interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  handler: string;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

export const schedulerApi = {
  // 获取所有任务
  getTasks: (): Promise<ApiResponse<{ tasks: ScheduledTask[] }>> => {
    return http.get('/scheduler');
  },

  // 创建任务
  createTask: (params: CreateTaskParams): Promise<ApiResponse<{ task: ScheduledTask }>> => {
    return http.post('/scheduler', params);
  },

  // 删除任务
  deleteTask: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return http.delete(`/scheduler/${id}`);
  },

  // 启动任务
  startTask: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return http.patch(`/scheduler/${id}`, { action: 'start' });
  },

  // 停止任务
  stopTask: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return http.patch(`/scheduler/${id}`, { action: 'stop' });
  },

  // 手动执行任务
  executeTask: (id: string): Promise<ApiResponse<{ message: string }>> => {
    return http.patch(`/scheduler/${id}`, { action: 'execute' });
  }
};