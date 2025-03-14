import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '智能聊天',
  description: '智能聊天'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}