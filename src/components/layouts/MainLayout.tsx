'use client'

import { TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { usePathname, useRouter } from 'next/navigation'

const tabs = [
  {
    key: '/',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: '/message',
    title: '消息',
    icon: <MessageOutline />,
  },
  {
    key: '/me',
    title: '我的',
    icon: <UserOutline />,
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
    <div className="min-h-screen flex flex-col pb-[calc(56px+env(safe-area-inset-bottom))]">
      <div className="flex-1">{children}</div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <TabBar 
          activeKey={pathname} 
          onChange={(key) => router.push(key)}
          className="h-14"
        >
          {tabs.map(item => (
            <TabBar.Item 
              key={item.key} 
              icon={item.icon} 
              title={item.title}
            />
          ))}
        </TabBar>
      </div>
    </div>
  )
}