import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';

const mockMessages = [
  {
    id: '1',
    title: '关于项目进展的讨论',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: '新功能开发计划',
    updated_at: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    title: '技术架构评审',
    updated_at: '2024-01-13T09:20:00Z',
  },
];

export const GET = () => {
  return withErrorHandler(async () => {
    return NextResponse.json({
      code: 0,
      data: mockMessages,
    });
  });
};