'use client'

import { useStore, useUserStore } from '@/store'

export default function ExamplePage() {
  // 使用全局状态
  const { count, increment, decrement } = useStore()
  const { user, isLoggedIn, login, logout } = useUserStore()

  // 模拟登录
  const handleLogin = () => {
    login({
      id: '1',
      name: '测试用户',
      email: 'test@example.com'
    })
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Zustand 状态管理示例</h1>
      
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">计数器示例</h2>
        <p className="mb-4">当前计数: {count}</p>
        <div className="flex gap-2">
          <button 
            onClick={increment}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            增加
          </button>
          <button 
            onClick={decrement}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            减少
          </button>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">用户状态示例</h2>
        {isLoggedIn ? (
          <div>
            <p className="mb-2">已登录用户: {user?.name}</p>
            <p className="mb-4">邮箱: {user?.email}</p>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              退出登录
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            模拟登录
          </button>
        )}
      </div>
    </div>
  )
}