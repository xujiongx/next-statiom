'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Map, Clock, Target, Compass, Box } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Book,
    title: '基础知识',
    description: '经络穴位的基本理论和概念',
    href: '/subpackages/tcm/meridian/basics',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Map,
    title: '经络图谱',
    description: '十二正经和奇经八脉的详细信息',
    href: '/subpackages/tcm/meridian/map',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: Target,
    title: '灵龟八法',
    description: '八脉交会穴的配伍和应用',
    href: '/subpackages/tcm/meridian/lingguibafa',
    color: 'bg-green-50 text-green-600'
  },

  {
    icon: Clock,
    title: '子午流注',
    description: '十二时辰经络气血流注规律',
    href: '/subpackages/tcm/meridian/timing',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: Compass,
    title: '流注八法盘',
    description: '子午流注和灵龟八法的可视化圆盘',
    href: '/subpackages/tcm/meridian/wheel',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: Box,
    title: '3D人体模型',
    description: '精细化3D人体模型与穴位标注',
    href: '/subpackages/tcm/meridian/model3d',
    color: 'bg-cyan-50 text-cyan-600'
  },
];

export default function MeridianPage() {
  return (
    <div className="container p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/subpackages/tcm" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">经络穴位</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} href={feature.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          探索中医经络穴位的奥秘，学习传统针灸理论与实践
        </p>
      </div>
    </div>
  );
}