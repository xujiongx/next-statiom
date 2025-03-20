import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我爱看猫猫',
  description: '我爱看猫猫'
}

export default function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}