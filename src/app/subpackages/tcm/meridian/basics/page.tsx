'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { concepts, twelveRegularMeridians, meridianFeatures } from './const';

export default function BasicsPage() {
  return (
    <div className="container p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/subpackages/tcm/meridian" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">经络穴位基础知识</h1>
      </div>

      {/* 基础概念 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">基础概念</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((concept) => (
            <Card key={concept.id} className="p-4">
              <h3 className="text-lg font-semibold mb-2">{concept.title}</h3>
              <p className="text-gray-700 text-sm mb-3">{concept.content}</p>
              <div className="flex flex-wrap gap-1">
                {concept.keyPoints.map((point) => (
                  <Badge key={point} variant="secondary" className="text-xs">
                    {point}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 十二正经 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">十二正经</h2>
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">经络名称</th>
                  <th className="text-left p-2">所属脏腑</th>
                  <th className="text-left p-2">当令时间</th>
                  <th className="text-left p-2">穴位数</th>
                </tr>
              </thead>
              <tbody>
                {twelveRegularMeridians.map((meridian, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{meridian.name}</td>
                    <td className="p-2">{meridian.organ}</td>
                    <td className="p-2">{meridian.time}</td>
                    <td className="p-2">{meridian.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 经络特点 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">经络特点</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meridianFeatures.map((feature, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}