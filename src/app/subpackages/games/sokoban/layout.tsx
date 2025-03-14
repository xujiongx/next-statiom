import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '推箱子',
  description: '推箱子'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}