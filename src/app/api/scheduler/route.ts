import { NextRequest, NextResponse } from 'next/server';
import { schedulerService } from '@/server/services/scheduler.service';
import { withErrorHandler } from '@/lib/api';
import { getUserId } from '@/lib/auth';

// 获取当前用户的所有任务
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const userId = await getUserId(request);
    const tasks = await schedulerService.getAllTasks(userId);
    return NextResponse.json({
      code: 0,
      data: {
        tasks
      }
    });
  });
}

// 创建新任务
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const userId = await getUserId(request);
    const body = await request.json();
    const { name, cronExpression, handler, isActive } = body;

    if (!name || !cronExpression || !handler) {
      return NextResponse.json(
        { code: 400, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    const task = await schedulerService.createTask({
      name,
      cronExpression,
      handler,
      isActive,
      userId // 传递用户ID
    });

    return NextResponse.json({
      code: 0,
      data: {
        task
      }
    });
  });
}