"use client";

import { MessageSquare, Palette } from "lucide-react";
import PageContainer from "@/components/ui/page-container";

export default function ToolsPage() {
  const features = [
    {
      id: "openrouter-chat",
      title: "OpenRouter 聊天",
      icon: <MessageSquare className="h-6 w-6" />,
      description: "使用 OpenRouter API 进行对话，体验 GPT-4o 多种模型",
      path: "/subpackages/tools/openrouter-chat",
    },
    {
      id: "effects",
      title: "特效样式展示",
      icon: <Palette className="h-6 w-6" />,
      description: "探索各种CSS特效和动画效果，包括粒子、渐变、动画等",
      path: "/subpackages/tools/effects",
    },
  ];

  return (
    <PageContainer
      title="AI 工具箱"
      description="探索更多实用的 AI 工具，提升工作效率和创造力"
      features={features}
      gridCols={{
        sm: 1,
        lg: 2,
        xl: 3,
        "2xl": 3,
      }}
      developmentTipText="更多强大的AI工具正在开发中，敬请期待"
    />
  );
}
