import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '趣味游戏',
  description: '趣味游戏'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}