import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '消息',
  description: '消息'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}