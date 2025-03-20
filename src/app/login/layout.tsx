import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登陆',
  description: '登陆'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}