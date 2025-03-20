import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '贪吃蛇',
  description: '贪吃蛇'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}