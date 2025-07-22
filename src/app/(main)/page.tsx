'use client';

import {
  MessageSquare,
  Image,
  Gamepad2,
  MoreHorizontal,
  Leaf,
  FileText,
  ArrowRight,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  MousePointerClick,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const tools = [
  {
    title: '智能聊天',
    description: '与 AI 助手进行对话，获得智能回答和建议',
    icon: MessageSquare,
    href: '/subpackages/chat',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badge: '热门',
    badgeColor: 'bg-red-500',
  },
  {
    title: '文字处理',
    description: '智能文本编辑、格式化与内容优化工具',
    icon: FileText,
    href: '/subpackages/text',
    gradient: 'from-orange-500 to-red-600',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    badge: '新功能',
    badgeColor: 'bg-green-500',
  },
  {
    title: '图片处理',
    description: '智能图片编辑与优化，让你的图片更出色',
    icon: Image,
    href: '/subpackages/image',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: '趣味游戏',
    description: '休闲小游戏合集，工作之余的放松时光',
    icon: Gamepad2,
    href: '/subpackages/games',
    gradient: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: '趣味中医',
    description: '中医知识学习与体质测试，关注健康生活',
    icon: Leaf,
    href: '/subpackages/tcm',
    gradient: 'from-green-500 to-emerald-600',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: '更多工具',
    description: '探索更多 AI 工具，发现无限可能',
    icon: MoreHorizontal,
    href: '/subpackages/tools',
    gradient: 'from-gray-500 to-slate-600',
    iconBg: 'bg-gray-100 dark:bg-gray-800/50',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
];

// 添加特色功能展示
const features = [
  {
    title: '智能对话',
    description: '基于先进的大语言模型，提供自然、流畅的对话体验',
    icon: MessageSquare,
    color: 'text-blue-500',
  },
  {
    title: '高效创作',
    description: '智能辅助内容创作，提高工作效率，激发创意灵感',
    icon: TrendingUp,
    color: 'text-purple-500',
  },
  {
    title: '个性定制',
    description: '根据个人需求定制AI助手，打造专属智能体验',
    icon: MousePointerClick,
    color: 'text-orange-500',
  },
  {
    title: '即时响应',
    description: '快速响应用户需求，提供实时、准确的信息和建议',
    icon: Zap,
    color: 'text-yellow-500',
  },
];

// 添加用户评价
const testimonials = [
  {
    content: '这款AI助手彻底改变了我的工作方式，让我的效率提升了至少50%！',
    author: '张先生',
    role: '自由撰稿人',
    rating: 5,
  },
  {
    content: '界面简洁易用，功能强大，是我日常工作中不可或缺的得力助手。',
    author: '李女士',
    role: '产品经理',
    rating: 5,
  },
  {
    content: '智能聊天功能非常棒，回答准确且有深度，比市面上大多数AI产品都要好用。',
    author: '王先生',
    role: '软件工程师',
    rating: 4,
  },
];

export default function Home() {
  // 添加滚动动画效果
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* 顶部英雄区域 - 现代化设计 */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 dark:from-indigo-950 dark:via-purple-950 dark:to-violet-950">
          {/* 动态网格背景 */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          {/* 动态光效 */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-400/5 dark:to-blue-400/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* 浮动粒子效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30 animate-float"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
          <div
            className="mb-6 transform transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <div className="relative inline-block">
              <Sparkles className="w-16 h-16 mx-auto text-yellow-400 dark:text-yellow-300 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white dark:from-gray-100 dark:via-purple-300 dark:to-gray-100 animate-gradient-x">
              AI分身
            </span>
            <div className="absolute -top-3 -right-3 text-yellow-300 animate-bounce">
              <Star className="w-6 h-6 fill-yellow-300" />
            </div>
          </h1>

          <h2 className="text-2xl md:text-3xl font-medium mb-4 opacity-95 text-white dark:text-gray-100">
            开启AI时代的无限可能
          </h2>

          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-4xl mx-auto leading-relaxed text-white dark:text-gray-200">
            让人工智能成为你最得力的助手，探索前沿的AI技术，提升工作效率和创造力
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/subpackages/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300 px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl w-48 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  开始探索{" "}
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 dark:bg-white/15 border-white/50 dark:border-white/30 text-white backdrop-blur-sm px-12 py-6 text-xl font-semibold w-48 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                了解更多
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 特色功能区域 - 新增 */}
      <section className="py-16 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <span className="relative inline-block">
              <span>为什么选择我们</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </span>
          </h3>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            我们提供最先进的AI技术，帮助您提高工作效率，激发创意灵感
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              style={{
                transform: `translateY(${
                  Math.min(50, Math.max(0, scrollY - 300)) * 0.1
                }px)`,
                opacity: scrollY > 200 ? 1 : 0,
                transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
              }}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${feature.color
                  .replace("text", "bg")
                  .replace("500", "100")} dark:bg-opacity-20`}
              >
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 工具菜单列表区域 - 优化 */}
      <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 relative bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900">
        {/* 添加节标题 */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <span className="relative inline-block">
              <span>精选工具</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            </span>
          </h3>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索我们精心打造的AI工具集合，每一个都能为你带来全新的体验
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* 工具卡片网格 - 优化响应式布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {tools.map((tool, index) => (
              <Link href={tool.href} key={tool.href} className="group">
                <Card
                  className="h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden relative"
                  style={{
                    transform: `translateY(${
                      Math.min(100, Math.max(0, scrollY - 500 - index * 50)) *
                      0.2
                    }px)`,
                    opacity: scrollY > 400 + index * 50 ? 1 : 0,
                    transition:
                      "transform 0.5s ease-out, opacity 0.5s ease-out, box-shadow 0.3s ease, scale 0.3s ease",
                  }}
                >
                  {/* 卡片背景渐变 */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-8 dark:group-hover:opacity-12 transition-opacity duration-500`}
                  ></div>

                  {/* 徽章 - 新增 */}
                  {tool.badge && (
                    <div
                      className={`absolute top-4 right-4 ${tool.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full z-20`}
                    >
                      {tool.badge}
                    </div>
                  )}

                  <CardHeader className="pb-4 md:pb-6 relative z-10">
                    <div className="flex items-start gap-4 md:gap-5 mb-4 md:mb-5">
                      <div
                        className={`p-3 md:p-5 rounded-xl md:rounded-2xl ${tool.iconBg} group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md relative overflow-hidden`}
                      >
                        {/* 图标背景动画 */}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 skew-x-12"></div>
                        <tool.icon
                          className={`w-8 h-8 md:w-10 md:h-10 ${tool.iconColor} relative z-10`}
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mb-2 md:mb-3">
                          {tool.title}
                        </CardTitle>
                        <div
                          className={`h-1 md:h-1.5 w-12 md:w-16 bg-gradient-to-r ${tool.gradient} rounded-full group-hover:w-20 md:group-hover:w-24 transition-all duration-300`}
                        ></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                      {tool.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        立即使用
                      </span>
                      <div
                        className={`p-2 md:p-3 rounded-full bg-gradient-to-r ${tool.gradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden`}
                      >
                        {/* 按钮光效 */}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 skew-x-12"></div>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
                      </div>
                    </div>
                  </CardContent>

                  {/* 悬停效果装饰 */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white dark:via-slate-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* 添加底部光效 */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-600 to-transparent"></div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 添加底部装饰 */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent"></div>
      </section>

      {/* 用户评价区域 - 新增 */}
      <section className="py-16 md:py-20 px-4 md:px-6 relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            <span className="relative inline-block">
              <span>用户评价</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            </span>
          </h3>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            听听我们的用户怎么说
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                transform: `translateY(${
                  Math.min(100, Math.max(0, scrollY - 800 - index * 50)) * 0.2
                }px)`,
                opacity: scrollY > 700 + index * 50 ? 1 : 0,
                transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 italic">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 底部CTA区域 */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            准备好体验AI的力量了吗？
          </h3>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            立即开始使用我们的AI工具，提升工作效率，激发创意灵感
          </p>
          <Link href="/subpackages/chat">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-blue-50 border-0 hover:scale-105 transition-all duration-300 px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl"
            >
              免费开始使用
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}