"use client";

import { MessageSquare, Palette, Mic, Bot, Volume2 } from "lucide-react";
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
    {
      id: "speech",
      title: "语音处理工具",
      icon: <Mic className="h-6 w-6" />,
      description: "语音转文本和文本转语音功能，基于Web Speech API实现",
      path: "/subpackages/tools/speech",
    },
    {
      id: "digital-human",
      title: "3D数字人模型",
      icon: <Bot className="h-6 w-6" />,
      description: "加载和展示3D数字人模型，支持动画控制和交互操作",
      path: "/subpackages/tools/digital-human",
    },
    {
      id: "alibaba-tts",
      title: "阿里百炼TTS",
      icon: <Volume2 className="h-6 w-6" />,
      description: "使用阿里百炼API进行文本转语音，支持多种语音角色和参数调试",
      path: "/subpackages/tools/alibaba-tts",
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
