'use client';

import { useEffect } from 'react';

export default function SchedulerInitializer() {
  useEffect(() => {
    // 通过 API 路由初始化定时任务
    fetch('/api/scheduler/init', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 0) {
        console.log('定时任务初始化成功:', data.message);
      } else {
        console.error('定时任务初始化失败:', data.message || data.error);
      }
    })
    .catch(error => {
      console.error('定时任务初始化请求失败:', error);
    });
  }, []);

  return null; // 不渲染任何内容
}