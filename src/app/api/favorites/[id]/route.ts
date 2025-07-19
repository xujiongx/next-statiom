import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api";
import { getServerSession } from "@/lib/auth";
import { favoriteService } from "@/server/services/favorite.service";

// 添加响应数据的接口定义
interface ApiResponse {
  code: number;
  data?: {
    message?: string;
  };
  message?: string;
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// 删除收藏
export async function DELETE(request: NextRequest, context: RouteParams) {
  const params = await context.params;
  // 使用withErrorHandler包装异步函数
  return withErrorHandler(async () => {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { code: 401, message: "未授权访问" } as ApiResponse,
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const favoriteId = params.id;

    // 验证ID格式
    if (!favoriteId || favoriteId.trim() === "") {
      return NextResponse.json(
        { code: 400, message: "无效的收藏ID" } as ApiResponse,
        { status: 400 },
      );
    }

    await favoriteService.deleteFavorite(favoriteId, userId);

    return NextResponse.json({
      code: 0,
      data: { message: "删除成功" },
    } as ApiResponse);
  });
}
