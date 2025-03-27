import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { withErrorHandler } from '@/lib/api';
import { authService } from '@/server/services/auth.service';

async function getWechatAccessToken(code: string) {
  const appId = process.env.NEXT_PUBLIC_WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.errcode) {
    throw new Error(data.errmsg);
  }

  return data;
}

async function getWechatUserInfo(accessToken: string, openId: string) {
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.errcode) {
    throw new Error(data.errmsg);
  }

  return data;
}

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return Response.json(
        { code: 400, message: '无效的请求' },
        { status: 400 }
      );
    }

    try {
      // 获取访问令牌
      const tokenInfo = await getWechatAccessToken(code);

      // 获取用户信息
      const userInfo = await getWechatUserInfo(
        tokenInfo.access_token,
        tokenInfo.openid
      );

      // 处理用户登录或注册
      const result = await authService.handleWechatLogin({
        openId: tokenInfo.openid,
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl,
      });

      // 设置登录态
      const cookieStore = await cookies();
      cookieStore.set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7天
      });
      sessionStorage.setItem('token', result.token);

      // 关闭窗口并刷新父窗口
      return new Response(
        `
        <script>
          window.opener.postMessage({ type: 'LOGIN_SUCCESS', data: ${JSON.stringify(
            result
          )} }, '*');
          window.close();
        </script>
        `,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    } catch (error) {
      console.error('微信登录失败:', error);
      return new Response(
        `
        <script>
          window.opener.postMessage({ type: 'LOGIN_ERROR', error: '登录失败，请稍后重试' }, '*');
          window.close();
        </script>
        `,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
  });
}
