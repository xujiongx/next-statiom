import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '个人中心',
  description: '个人中心'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}