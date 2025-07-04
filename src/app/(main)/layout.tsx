
import MainLayout from '@/components/layouts/MainLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AI分身",
  description: "智能聊天、对联生成、图片处理等多功能 AI 工具集合",
};

export default function MainRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}