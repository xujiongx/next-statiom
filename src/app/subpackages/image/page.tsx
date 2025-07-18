"use client";

import { Cat, Wand2, User, Palette } from 'lucide-react';
import PageContainer from '@/components/ui/page-container';

export default function ImagePage() {
  const features = [
    {
      id: 'generate',
      title: 'AI 图片生成',
      icon: <Wand2 className='h-6 w-6' />,
      description: '输入描述，生成独特的 AI 图片',
      path: '/subpackages/image/generate',
    },
    {
      id: 'avatar',
      title: 'AI 头像生成',
      icon: <User className='h-6 w-6' />,
      description: '生成个性化的AI头像',
      path: '/subpackages/image/avatar',
    },
    {
      id: 'cat',
      title: '我爱看猫猫',
      icon: <Cat className='h-6 w-6' />,
      description: '随机展示可爱的猫咪图片',
      path: '/subpackages/image/cat',
    },
    {
      id: 'poster',
      title: 'AI 海报生成',
      icon: <Palette className='h-6 w-6' />,
      description: '智能生成营销海报',
      path: '/subpackages/image/poster',
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
