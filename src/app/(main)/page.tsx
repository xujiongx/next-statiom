'use client';

import {
  MessageSquare,
  Image,
  Gamepad2,
  MoreHorizontal,
  Leaf,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tools = [
  {
    title: '智能聊天',
    description: '与 AI 助手进行对话，获得智能回答和建议',
    icon: MessageSquare,
    href: '/subpackages/chat',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: '图片处理',
    description: '智能图片编辑与优化，让你的图片更出色',
    icon: Image,
    href: '/subpackages/image',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: '趣味游戏',
    description: '休闲小游戏合集，工作之余的放松时光',
    icon: Gamepad2,
    href: '/subpackages/games',
    gradient: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: '趣味中医',
    description: '中医知识学习与体质测试，关注健康生活',
    icon: Leaf,
    href: '/subpackages/tcm',
    gradient: 'from-green-500 to-emerald-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: '更多工具',
    description: '探索更多 AI 工具，发现无限可能',
    icon: MoreHorizontal,
    href: '/subpackages/tools',
    gradient: 'from-gray-500 to-slate-600',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 顶部CTA区域 */}
      <section className="py-12 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 mx-auto text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
            AI工具箱
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-4 opacity-95">
            开启AI时代的无限可能
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed">
            让人工智能成为你最得力的助手，探索前沿的AI技术，提升工作效率和创造力
          </p>
          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
            <Button 
              size="lg" 
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:scale-105 transition-all duration-300 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl w-48'
            >
              开始探索
              <ArrowRight className='w-6 h-6' />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className='bg-white/10 border-white/20 text-white backdrop-blur-sm px-12 py-4 text-xl font-semibold w-48'
            >
              了解更多
            </Button>
          </div>
        </div>
      </section>

      {/* 工具菜单列表区域 */}
      <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 relative">
        {/* 添加节标题 */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            精选工具
          </h3>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            探索我们精心打造的AI工具集合，每一个都能为你带来全新的体验
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* 工具卡片网格 - 优化响应式布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.href} className="group">
                <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden relative">
                  {/* 卡片背景渐变 */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500`}
                  ></div>

                  <CardHeader className="pb-4 md:pb-6 relative z-10">
                    <div className="flex items-start gap-4 md:gap-5 mb-4 md:mb-5">
                      <div
                        className={`p-3 md:p-5 rounded-xl md:rounded-2xl ${tool.iconBg} group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md`}
                      >
                        <tool.icon
                          className={`w-8 h-8 md:w-10 md:h-10 ${tool.iconColor}`}
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-2 md:mb-3">
                          {tool.title}
                        </CardTitle>
                        <div
                          className={`h-1 md:h-1.5 w-12 md:w-16 bg-gradient-to-r ${tool.gradient} rounded-full group-hover:w-20 md:group-hover:w-24 transition-all duration-300`}
                        ></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                      {tool.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                        立即使用
                      </span>
                      <div
                        className={`p-2 md:p-3 rounded-full bg-gradient-to-r ${tool.gradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </div>
                  </CardContent>

                  {/* 悬停效果装饰 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* 添加底部光效 */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 添加底部装饰 */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </section>
    </main>
  );
}
