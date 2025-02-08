'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserInfo {
  id: number
  username: string
  nickname?: string
}

export default function MePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo')
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo))
    } else {
      router.replace('/login')
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
    router.push('/login')
  }

  if (!userInfo) return null

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">个人中心</h1>
      
      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">{userInfo.nickname?.[0] || userInfo.username[0]}</span>
          </div>
          <div>
            <h2 className="text-lg font-medium">{userInfo.nickname || userInfo.username}</h2>
            <p className="text-gray-500 text-sm">ID: {userInfo.id}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}