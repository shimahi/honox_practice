import { UserDomain } from '@/domains/user'
import type { Context } from '@/global'
import { googleAuth } from '@hono/oauth-providers/google'
import { OAuth2Client as GoogleAuthClient } from 'google-auth-library'
import type { Next } from 'hono'
import { env } from 'hono/adapter'
import { getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

const GOOGLE_AUTH_TOKEN = 'googleAuthToken'

export const authMiddlewares = {
  /**
   * cookieから認証状態を確認し、コンテキストにユーザー情報をセットする
   */
  async authorize(c: Context, next: Next) {
    const profileIds = await getProfileIds(c)

    if (!Object.keys(profileIds).length) {
      await next()
    }

    const userDomain = new UserDomain(c)
    const user = userDomain.getUserByProfileId(profileIds)

    if (!user) {
      await next()
    }
    c.set('currentUser', user)
    await next()
  },
  /**
   * authorizeと同じ処理だが、
   * ログインしていない場合にエラーを投げる
   */
  async authorizeWithError(c: Context, next: Next) {
    const profileIds = await getProfileIds(c)

    if (!Object.keys(profileIds).length) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const userDomain = new UserDomain(c)
    const user = userDomain.getUserByProfileId(profileIds)

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
    c.set('currentUser', user)
    await next()
  },

  /**
   * Google認証を行い、成功したらアクセストークンをコンテキストにセットする
   * https://github.com/honojs/middleware/blob/main/packages/oauth-providers/src/providers/google/googleAuth.ts
   */
  async signInWithGoogle(c: Context, next: Next) {
    const handler = googleAuth({
      client_id: env(c).GOOGLE_AUTH_CLIENT_ID,
      client_secret: env(c).GOOGLE_AUTH_CLIENT_SECRET,
      scope: ['openid', 'email', 'profile'],
    })
    return await handler(c, next)
  },
  /**
   * Google認証後に呼び出す処理
   * コンテキストから取得したアクセストークンをcookieにセットする
   * また、新規ユーザーの場合はユーザー情報をDB登録する
   */
  async afterSignInWithGoogle(c: Context, next: Next) {
    const token = c.get('token')?.token

    if (!token) {
      return c.redirect('/')
    }

    setCookie(c, GOOGLE_AUTH_TOKEN, token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: true,
      path: '/',
    })

    // TODO: 初めてのGoogle認証の場合はユーザー情報をDB登録する

    return await next()
  },
}

/**
 * アクセストークンから認証プロバイだーのプロファイルIDを取得する
 */
async function getProfileIds(c: Context) {
  const googleProfileId = (await getGoogleTokenInfo(c))?.sub

  return { googleProfileId }
}

/**
 * cookieのアクセストークンからGoogle認証情報を取得する
 */
async function getGoogleTokenInfo(c: Context) {
  const token = getCookie(c, GOOGLE_AUTH_TOKEN)

  if (!token) {
    return null
  }

  const authClient = new GoogleAuthClient()
  return await authClient.getTokenInfo(token)
}
