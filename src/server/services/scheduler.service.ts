import { prisma } from '@/lib/db';
import { ApiError } from '@/lib/error';
import * as cron from 'node-cron';
import { PixabayService } from './pixabay.service';

interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  handler: string;
  isActive: boolean;
  lastRun?: Date | null;
  nextRun?: Date | null;
  createdAt: Date;
}

interface CreateTaskParams {
  name: string;
  cronExpression: string;
  handler: string;
  isActive?: boolean;
  userId: string;
}

export class SchedulerService {
  private tasks: Map<string, cron.ScheduledTask> = new Map();

  async createTask(params: CreateTaskParams): Promise<ScheduledTask> {
    const { name, cronExpression, handler, isActive = true, userId } = params;

    if (!cron.validate(cronExpression)) {
      throw new ApiError('无效的 cron 表达式', 400);
    }

    const task = await prisma.scheduledTask.create({
      data: {
        name,
        cronExpression,
        handler,
        isActive,
        userId,
      },
      select: {
        id: true,
        name: true,
        cronExpression: true,
        handler: true,
        isActive: true,
        lastRun: true,
        nextRun: true,
        createdAt: true,
      },
    });

    if (isActive) {
      this.scheduleTask(task);
    }

    return task;
  }

  async getAllTasks(userId?: string): Promise<ScheduledTask[]> {
    return prisma.scheduledTask.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        cronExpression: true,
        handler: true,
        isActive: true,
        lastRun: true,
        nextRun: true,
        createdAt: true,
      },
    });
  }

  async startTask(taskId: string): Promise<void> {
    const task = await prisma.scheduledTask.update({
      where: { id: taskId },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        cronExpression: true,
        handler: true,
        isActive: true,
        lastRun: true,
        nextRun: true,
        createdAt: true,
      },
    });

    this.scheduleTask(task);
  }

  async stopTask(taskId: string): Promise<void> {
    await prisma.scheduledTask.update({
      where: { id: taskId },
      data: { isActive: false },
    });

    this.unscheduleTask(taskId);
  }

  async deleteTask(taskId: string): Promise<void> {
    this.unscheduleTask(taskId);

    await prisma.scheduledTask.delete({
      where: { id: taskId },
    });
  }

  async executeTask(taskId: string): Promise<void> {
    const task = await prisma.scheduledTask.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        name: true,
        handler: true,
      },
    });

    if (!task) {
      throw new ApiError('任务不存在', 404);
    }

    await this.runTaskHandler(task);
  }

  async initializeTasks(): Promise<void> {
    const activeTasks = await prisma.scheduledTask.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        cronExpression: true,
        handler: true,
        isActive: true,
        lastRun: true,
        nextRun: true,
        createdAt: true,
      },
    });

    for (const task of activeTasks) {
      this.scheduleTask(task);
    }
  }

  private scheduleTask(task: ScheduledTask): void {
    this.unscheduleTask(task.id);

    const scheduledTask = cron.schedule(
      task.cronExpression,
      async () => {
        await this.runTaskHandler(task);
      },
      {
        timezone: 'Asia/Shanghai',
      },
    );

    scheduledTask.start();
    this.tasks.set(task.id, scheduledTask);
    console.log(`任务已调度: ${task.name} (${task.cronExpression})`);
  }

  private unscheduleTask(taskId: string): void {
    const scheduledTask = this.tasks.get(taskId);
    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask.destroy();
      this.tasks.delete(taskId);
      console.log(`任务已取消调度: ${taskId}`);
    }
  }

  private async runTaskHandler(task: Pick<ScheduledTask, 'id' | 'name' | 'handler'>): Promise<void> {
    try {
      console.log(`开始执行任务: ${task.name}`);

      await prisma.scheduledTask.update({
        where: { id: task.id },
        data: { lastRun: new Date() },
      });

      await this.executeHandler(task.handler);

      console.log(`任务执行完成: ${task.name}`);
    } catch (error) {
      console.error(`任务执行失败: ${task.name}`, error);
    }
  }

  private async executeHandler(handler: string): Promise<void> {
    switch (handler) {
      case 'cleanupLogs':
        await this.cleanupLogs();
        break;
      case 'sendNotifications':
        await this.sendNotifications();
        break;
      case 'backupData':
        await this.backupData();
        break;
      case 'healthCheck':
        await this.healthCheck();
        break;
      case 'generateReports':
        await this.generateReports();
        break;
      case 'syncData':
        await this.syncData();
        break;
      default:
        console.warn(`未知的处理器: ${handler}`);
    }
  }

  private async cleanupLogs(): Promise<void> {
    console.log('执行日志清理任务...');
  }

  private async sendNotifications(): Promise<void> {
    console.log('发送通知任务...');
  }

  private async backupData(): Promise<void> {
    console.log('执行数据备份任务...');
  }

  private async healthCheck(): Promise<void> {
    console.log('执行健康检查任务...');
  }

  private async generateReports(): Promise<void> {
    console.log('生成报告任务...');
  }

  private async syncData(): Promise<void> {
    try {
      const pixabayService = new PixabayService();
      await pixabayService.syncData(3);
    } catch (error) {
      console.error('同步数据任务失败:', error);
    }
  }

  getTaskStatus(taskId: string): { isRunning: boolean; nextExecution?: Date } {
    const scheduledTask = this.tasks.get(taskId);
    if (!scheduledTask) {
      return { isRunning: false };
    }

    return {
      isRunning: scheduledTask.getStatus() === 'scheduled',
    };
  }

  getRunningTasks(): string[] {
    const runningTasks: string[] = [];
    this.tasks.forEach((task, taskId) => {
      if (task.getStatus() === 'scheduled') {
        runningTasks.push(taskId);
      }
    });
    return runningTasks;
  }

  stopAllTasks(): void {
    this.tasks.forEach((task) => {
      task.stop();
      task.destroy();
    });
    this.tasks.clear();
    console.log('所有任务已停止');
  }
}

export const schedulerService = new SchedulerService();
