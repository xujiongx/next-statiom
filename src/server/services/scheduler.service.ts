import { client } from "@/lib/db";
import { ApiError } from "@/lib/error";
import * as cron from "node-cron";

interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  handler: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
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

  // 创建定时任务
  async createTask(params: CreateTaskParams): Promise<ScheduledTask> {
    const { name, cronExpression, handler, isActive = true, userId } = params;

    // 验证 cron 表达式
    if (!cron.validate(cronExpression)) {
      throw new ApiError("无效的 cron 表达式", 400);
    }

    const task = await client.query<ScheduledTask>(
      `
    select (
      insert ScheduledTask {
        name := <str>$name,
        cronExpression := <str>$cronExpression,
        handler := <str>$handler,
        isActive := <bool>$isActive,
        user := (select User filter .id = <uuid>$userId),
        createdAt := datetime_current()
      }
    ) {
      id,
      name,
      cronExpression,
      handler,
      isActive,
      lastRun,
      nextRun,
      createdAt,
      user: { id, username, nickname }
    }
    `,
      { name, cronExpression, handler, isActive, userId },
    );

    if (isActive) {
      this.scheduleTask(task[0]);
    }

    return task[0];
  }

  // 获取所有任务
  async getAllTasks(userId?: string): Promise<ScheduledTask[]> {
    const query = userId 
      ? `
        select ScheduledTask {
          id,
          name,
          cronExpression,
          handler,
          isActive,
          lastRun,
          nextRun,
          createdAt,
          user: { id, username, nickname }
        } filter .user.id = <uuid>$userId
        order by .createdAt desc
      `
      : `
        select ScheduledTask {
          id,
          name,
          cronExpression,
          handler,
          isActive,
          lastRun,
          nextRun,
          createdAt,
          user: { id, username, nickname }
        }
        order by .createdAt desc
      `;
    
    const params = userId ? { userId } : {};
    return await client.query<ScheduledTask>(query, params);
  }

  // 启动任务
  async startTask(taskId: string): Promise<void> {
    const tasks = await client.query<ScheduledTask>(
      `
        select (
          update ScheduledTask
          filter .id = <uuid>$taskId
          set {
            isActive := true
          }
        ) {
          id,
          name,
          cronExpression,
          handler,
          isActive,
          lastRun,
          nextRun,
          createdAt
        }
      `,
      { taskId },
    );

    if (tasks.length > 0) {
      this.scheduleTask(tasks[0]);
    }
  }

  // 停止任务
  async stopTask(taskId: string): Promise<void> {
    await client.query(
      `
      update ScheduledTask
      filter .id = <uuid>$taskId
      set {
        isActive := false
      }
      `,
      { taskId },
    );

    this.unscheduleTask(taskId);
  }

  // 删除任务
  async deleteTask(taskId: string): Promise<void> {
    this.unscheduleTask(taskId);

    await client.query(
      `
      delete ScheduledTask
      filter .id = <uuid>$taskId
      `,
      { taskId },
    );
  }

  // 手动执行任务
  async executeTask(taskId: string): Promise<void> {
    const tasks = await client.query<ScheduledTask>(
      `
      select ScheduledTask {
        id,
        name,
        handler
      }
      filter .id = <uuid>$taskId
      limit 1
      `,
      { taskId },
    );

    if (tasks.length === 0) {
      throw new ApiError("任务不存在", 404);
    }

    await this.runTaskHandler(tasks[0]);
  }

  // 初始化所有活跃任务
  async initializeTasks(): Promise<void> {
    const activeTasks = await client.query<ScheduledTask>(
      `
      select ScheduledTask {
        id,
        name,
        cronExpression,
        handler,
        isActive,
        lastRun,
        nextRun,
        createdAt
      }
      filter .isActive = true
      `,
    );

    for (const task of activeTasks) {
      this.scheduleTask(task);
    }
  }

  // 调度任务
  private scheduleTask(task: ScheduledTask): void {
    // 如果任务已经存在，先取消
    this.unscheduleTask(task.id);

    // 使用 node-cron 创建定时任务
    const scheduledTask = cron.schedule(
      task.cronExpression,
      async () => {
        await this.runTaskHandler(task);
      },
      {
        timezone: "Asia/Shanghai", // 设置时区
      },
    );

    // 启动任务
    scheduledTask.start();

    this.tasks.set(task.id, scheduledTask);
    console.log(`任务已调度: ${task.name} (${task.cronExpression})`);
  }

  // 取消调度
  private unscheduleTask(taskId: string): void {
    const scheduledTask = this.tasks.get(taskId);
    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask.destroy();
      this.tasks.delete(taskId);
      console.log(`任务已取消调度: ${taskId}`);
    }
  }

  // 执行任务处理器
  private async runTaskHandler(task: ScheduledTask): Promise<void> {
    try {
      console.log(`开始执行任务: ${task.name}`);

      // 更新最后运行时间
      await client.query(
        `
        update ScheduledTask
        filter .id = <uuid>$taskId
        set {
          lastRun := datetime_current()
        }
        `,
        { taskId: task.id },
      );

      // 根据 handler 执行相应的任务
      await this.executeHandler(task.handler);

      console.log(`任务执行完成: ${task.name}`);
    } catch (error) {
      console.error(`任务执行失败: ${task.name}`, error);
    }
  }

  // 执行具体的处理器
  private async executeHandler(handler: string): Promise<void> {
    switch (handler) {
      case "cleanupLogs":
        await this.cleanupLogs();
        break;
      case "sendNotifications":
        await this.sendNotifications();
        break;
      case "backupData":
        await this.backupData();
        break;
      case "healthCheck":
        await this.healthCheck();
        break;
      case "generateReports":
        await this.generateReports();
        break;
      case "syncData":
        await this.syncData();
        break;
      default:
        console.warn(`未知的处理器: ${handler}`);
    }
  }

  // 示例任务处理器
  private async cleanupLogs(): Promise<void> {
    console.log("执行日志清理任务...");
    // 实现日志清理逻辑
    // 例如：删除30天前的日志文件
  }

  private async sendNotifications(): Promise<void> {
    console.log("发送通知任务...");
    // 实现通知发送逻辑
    // 例如：发送邮件、短信或推送通知
  }

  private async backupData(): Promise<void> {
    console.log("执行数据备份任务...");
    // 实现数据备份逻辑
    // 例如：备份数据库到云存储
  }

  private async healthCheck(): Promise<void> {
    console.log("执行健康检查任务...");
    // 实现健康检查逻辑
    // 例如：检查服务状态、数据库连接等
  }

  private async generateReports(): Promise<void> {
    console.log("生成报告任务...");
    // 实现报告生成逻辑
    // 例如：生成日报、周报、月报
  }

  private async syncData(): Promise<void> {
    console.log("数据同步任务...");
    // 实现数据同步逻辑
    // 例如：同步第三方API数据
  }

  // 获取任务状态信息
  getTaskStatus(taskId: string): { isRunning: boolean; nextExecution?: Date } {
    const scheduledTask = this.tasks.get(taskId);
    if (!scheduledTask) {
      return { isRunning: false };
    }

    return {
      isRunning: scheduledTask.getStatus() === "scheduled",
      // node-cron 不直接提供下次执行时间，可以使用其他库如 cron-parser 来计算
    };
  }

  // 获取所有运行中的任务
  getRunningTasks(): string[] {
    const runningTasks: string[] = [];
    this.tasks.forEach((task, taskId) => {
      if (task.getStatus() === "scheduled") {
        runningTasks.push(taskId);
      }
    });
    return runningTasks;
  }

  // 停止所有任务
  stopAllTasks(): void {
    this.tasks.forEach((task) => {
      task.stop();
      task.destroy();
    });
    this.tasks.clear();
    console.log("所有任务已停止");
  }
}

export const schedulerService = new SchedulerService();
