'use client';

import { Button } from "antd-mobile"

export default function Home() {
  return (
    <main className="p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">首页</h1>
        <Button color='primary' onClick={() => alert('Hello!')}>
          点击我
        </Button>
      </div>
    </main>
  )
}
