import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 这里模拟登录验证
    if (username === 'admin' && password === '123456') {
      return NextResponse.json({
        code: 0,
        data: {
          token: 'mock-token',
          user: {
            id: 1,
            username: 'admin',
            nickname: '管理员'
          }
        },
        message: '登录成功'
      })
    }

    return NextResponse.json({
      code: 401,
      message: '用户名或密码错误'
    }, { status: 401 })

  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 })
  }
}