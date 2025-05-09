'use client';
import { Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'OpenRouter 聊天',
    description: '使用 OpenRouter API 进行对话，体验 GPT-4o 等多种模型',
    icon: MessageSquare,
    href: '/subpackages/tools/openrouter-chat',
  },
  {
    title: '敬请期待',
    description: '更多AI工具正在开发',
    icon: Sparkles,
    href: '#',
  },
];

export default function ToolsPage() {
  return (
    <main className='container max-w-4xl p-6'>
      <div className='mb-4'>
        <h1 className='text-xl font-bold mb-1'>AI 工具箱</h1>
        <p className='text-sm text-muted-foreground'>探索更多实用的 AI 工具</p>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <div className='p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer'>
              <div className='flex items-center gap-2 mb-2'>
                <tool.icon className='w-5 h-5 text-primary' />
                <h2 className='text-lg font-semibold'>{tool.title}</h2>
              </div>
              <p className='text-sm text-muted-foreground'>
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
