import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 定义 store 的状态类型
interface StoreState {
  // 示例状态
  count: number
  theme: 'light' | 'dark'
  
  // 示例操作
  increment: () => void
  decrement: () => void
  setTheme: (theme: 'light' | 'dark') => void
  reset: () => void
}

// 创建 store
export const useStore = create<StoreState>()(
  // 使用 persist 中间件实现状态持久化
  persist(
    (set) => ({
      count: 0,
      theme: 'light',
      
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setTheme: (theme) => set({ theme }),
      reset: () => set({ count: 0, theme: 'light' }),
    }),
    {
      name: 'app-storage', // 存储的键名
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
      // 可选：指定哪些状态需要持久化
      partialize: (state) => ({ 
        count: state.count,
        theme: state.theme 
      }),
    }
  )
)