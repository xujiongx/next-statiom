'use client';

import Link from 'next/link';
import { Leaf, Heart, Brain, Stethoscope, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <div className="container p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">趣味中医</h1>
        <p className="text-gray-600 text-center">传承千年智慧，探索中医奥秘</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.id} href={feature.path}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-green-100 rounded-full">
                  {feature.icon}
                </div>
                <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}