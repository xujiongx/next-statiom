import { NextRequest, NextResponse } from 'next/server';
import { schedulerService } from '@/server/services/scheduler.service';
import { withErrorHandler } from '@/lib/api';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// 删除任务
export async function DELETE(request: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { id } = await params;
    await schedulerService.deleteTask(id);
    return NextResponse.json({
      code: 0,
      data: {
        message: '任务删除成功'
      }
    });
  });
}

// 更新任务状态
export async function PATCH(request: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'start':
        await schedulerService.startTask(id);
        break;
      case 'stop':
        await schedulerService.stopTask(id);
        break;
      case 'execute':
        await schedulerService.executeTask(id);
        break;
      default:
        return NextResponse.json(
          { code: 400, message: '无效的操作' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      code: 0,
      data: {
        message: '操作成功'
      }
    });
  });
}