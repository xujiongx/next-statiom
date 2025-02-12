'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, MessageSquare, User } from 'lucide-react'

const tabs = [
  {
    key: '/',
    title: '首页',
    icon: Home,
  },
  {
    key: '/message',
    title: '消息',
    icon: MessageSquare,
  },
  {
    key: '/me',
    title: '我的',
    icon: User,
  },
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-14 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-3 h-full">
          {tabs.map(({ key, title, icon: Icon }) => (
            <button
              key={key}
              onClick={() => router.push(key)}
              className={`flex flex-col items-center justify-center gap-1
                ${pathname === key 
                  ? 'text-blue-500' 
                  : 'text-gray-500'
                }
              `}
            >
              <Icon size={20} />
              <span className="text-xs">{title}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}