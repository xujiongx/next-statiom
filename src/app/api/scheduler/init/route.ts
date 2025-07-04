import { schedulerService } from '@/server/services/scheduler.service';
import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';

export async function POST() {
  return withErrorHandler(async () => {
    await schedulerService.initializeTasks();
    return NextResponse.json({
      code: 0,
      message: '定时任务初始化成功'
    });
  });
}