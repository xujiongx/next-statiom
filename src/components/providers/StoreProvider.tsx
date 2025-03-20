'use client'

import { useEffect, useState } from 'react'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isHydrated, setIsHydrated] = useState(false)

  // 等待客户端水合完成后再渲染子组件
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated ? <>{children}</> : null
}