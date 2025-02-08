'use client'

import { useEffect, useState } from 'react'

interface MessageProps {
  type: 'success' | 'error'
  content: string
  duration?: number
  onClose?: () => void
}

export function Message({ type, content, duration = 2000, onClose }: MessageProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-md bg-white">
      <div className={`flex items-center ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
        {content}
      </div>
    </div>
  )
}