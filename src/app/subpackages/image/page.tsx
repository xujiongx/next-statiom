'use client';

import Link from 'next/link';
import { Cat, Wand2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
      id: 'cat',
      title: '我爱看猫猫',
      icon: <Cat className='h-6 w-6' />,
      description: '随机展示可爱的猫咪图片',
      path: '/subpackages/image/cat',
    },
  ];

  return (
    <div className='container p-6'>
      <h1 className='text-2xl font-bold mb-6'>图片工具</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {features.map((feature) => (
          <Link key={feature.id} href={feature.path}>
            <Card className='p-4 hover:shadow-lg transition-shadow'>
              <div className='flex items-center gap-3'>
                {feature.icon}
                <div>
                  <h2 className='font-semibold'>{feature.title}</h2>
                  <p className='text-sm text-gray-500'>{feature.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
