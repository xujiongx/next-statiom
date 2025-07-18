"use client";

import { Leaf, Heart, Brain, Stethoscope, BookOpen } from 'lucide-react';
import PageContainer from '@/components/ui/page-container';

export default function TCMPage() {
  const features = [
    {
      id: 'constitution',
      title: '体质测试',
      icon: <Heart className="h-6 w-6" />,
      description: '中医九种体质辨识测试',
      path: '/subpackages/tcm/constitution',
    },
    {
      id: 'meridian',
      title: '经络穴位',
      icon: <Stethoscope className="h-6 w-6" />,
      description: '经络穴位知识学习',
      path: '/subpackages/tcm/meridian',
    },
    {
      id: 'herbs',
      title: '中药百科',
      icon: <Leaf className="h-6 w-6" />,
      description: '常用中药材介绍',
      path: '/subpackages/tcm/herbs',
    },
    {
      id: 'wellness',
      title: '养生建议',
      icon: <Brain className="h-6 w-6" />,
      description: '个性化养生指导',
      path: '/subpackages/tcm/wellness',
    },
    {
      id: 'knowledge',
      title: '中医知识',
      icon: <BookOpen className="h-6 w-6" />,
      description: '中医基础理论学习',
      path: '/subpackages/tcm/knowledge',
    },
  ];

  return (
    <PageContainer
      title="趣味中医"
      description="传承千年智慧，探索中医奥秘，学习传统医学精髓"
      features={features}
      gridCols={{
        sm: 1,
        lg: 2,
        xl: 3,
        "2xl": 3,
      }}
      developmentTipText="更多中医功能正在开发中，敬请期待"
    />
  );
}