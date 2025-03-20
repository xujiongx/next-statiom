'use client';
import { MessageSquare, AlignCenter, Image, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: '智能聊天',
    description: '与 AI 助手进行对话',
    icon: MessageSquare,
    href: '/subpackages/chat',
  },
  {
    title: '对联生成',
    description: '自动生成对联和横批',
    icon: AlignCenter,
    href: '/couplet',
  },
  {
    title: '图片处理',
    description: '智能图片编辑与优化',
    icon: Image,
    href: '/subpackages/image',
  },
  {
    title: '趣味游戏',
    description: '休闲小游戏合集',
    icon: Gamepad2,
    href: '/subpackages/games',
  },
];

export default function Home() {
  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <tool.icon className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">{tool.title}</h2>
              </div>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
