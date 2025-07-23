"use client";

import { Cat, Wand2, User, Palette, Scissors, Move, Crop } from "lucide-react";
import PageContainer from "@/components/ui/page-container";

export default function ImagePage() {
  const features = [
    {
      id: "generate",
      title: "AI 图片生成",
      icon: <Wand2 className="h-6 w-6" />,
      description: "输入描述，生成独特的 AI 图片",
      path: "/subpackages/image/generate",
    },
    {
      id: "avatar",
      title: "AI 头像生成",
      icon: <User className="h-6 w-6" />,
      description: "生成个性化的AI头像",
      path: "/subpackages/image/avatar",
    },
    {
      id: "background-removal",
      title: "AI 智能抠图",
      icon: <Scissors className="h-6 w-6" />,
      description: "一键去除图片背景，智能抠图处理",
      path: "/subpackages/image/background-removal",
    },
    {
      id: "resize",
      title: "图片尺寸调整",
      icon: <Move className="h-6 w-6" />,
      description: "调整图片大小，保持或自定义宽高比",
      path: "/subpackages/image/resize",
    },
    {
      id: "crop",
      title: "图片裁剪",
      icon: <Crop className="h-6 w-6" />,
      description: "自由裁剪图片，保留需要的部分",
      path: "/subpackages/image/crop",
    },
    {
      id: "cat",
      title: "我爱看猫猫",
      icon: <Cat className="h-6 w-6" />,
      description: "随机展示可爱的猫咪图片",
      path: "/subpackages/image/cat",
    },
    {
      id: "poster",
      title: "AI 海报生成",
      icon: <Palette className="h-6 w-6" />,
      description: "智能生成营销海报",
      path: "/subpackages/image/poster",
    },
    // 在 features 数组中添加新的功能项
    {
      id: "selection-removal",
      title: "框选抠图",
      icon: <Scissors className="h-6 w-6" />,
      description: "框选需要保留的区域，一键抠图生成透明背景图片",
      path: "/subpackages/image/selection-removal",
    },
  ];

  return (
    <PageContainer
      title="图片处理工具"
      description="提供AI图片生成、头像制作、海报设计等多种图片处理功能"
      features={features}
      gridCols={{
        sm: 2,
        lg: 3,
        xl: 4,
        "2xl": 5,
      }}
      developmentTipText="更多AI图片功能正在开发中，敬请期待"
    />
  );
}
