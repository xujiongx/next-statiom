import { NextRequest, NextResponse } from 'next/server';
import { schedulerService } from '@/server/services/scheduler.service';
import { withErrorHandler } from '@/lib/api';

// 获取所有任务
export async function GET() {
  return withErrorHandler(async () => {
    const tasks = await schedulerService.getAllTasks();
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
      isActive
    });

    return NextResponse.json({
      code: 0,
      data: {
        task
      }
    });
  });
}