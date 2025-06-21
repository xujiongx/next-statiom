import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '趣味中医',
  description: '中医知识学习与体质测试'
}

export default function TCMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}