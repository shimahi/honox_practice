import { UserDomain } from '@/domains/user'
import type { Context } from '@/global'

import { googleAuth } from '@hono/oauth-providers/google'
import type { Next } from 'hono'
import { env } from 'hono/adapter'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

export const authMiddlewares = {
  /**
   * cookieが保持しているアクセストークンから認証状態を確認し、コンテキストにユーザー情報をセットする
   */
  async authorize(c: Context, next: Next) {
    const profileIds = await getProfileIds(c)
    const userDomain = new UserDomain(c)
    const user = await userDomain.getUserByProfileIds(profileIds)
    c.set('currentUser', user)
    return next()
  },
  /**
   * authorizeと同じ処理だが、
   * ログインしていない場合にエラーを投げる
   */
  async authorizeWithError(c: Context, next: Next) {
    const profileIds = await getProfileIds(c)
    const userDomain = new UserDomain(c)
    const user = await userDomain.getUserByProfileIds(profileIds)
    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    c.set('currentUser', user)
    await next()
  },
  /**
   *
   * 認証情報を削除する
   */
  signOut(c: Context, next: Next) {
    deleteCookie(c, 'googleAuthToken')
    next()
  },

  /**
   * Google認証を行い、成功したらアクセストークンをコンテキストにセットする
   * https://github.com/honojs/middleware/blob/main/packages/oauth-providers/src/providers/google/googleAuth.ts
   */
  signInWithGoogle(c: Context, next: Next) {
    return googleAuth({
      client_id: env(c).GOOGLE_AUTH_CLIENT_ID,
      client_secret: env(c).GOOGLE_AUTH_CLIENT_SECRET,
      scope: ['openid', 'email', 'profile'],
    })(c, next)
  },
  /**
   * Google認証後に呼び出す処理
   * コンテキストから取得したアクセストークンをcookieにセットする
   * また、新規ユーザーの場合はユーザー情報をDB登録する
   */
  async afterSignInWithGoogle(c: Context, next: Next) {
    const token = c.get('token')
    const googleUser = c.get('user-google')

    if (!(token && googleUser)) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
    // cookieにアクセストークンをセットする
    setCookie(c, 'googleAuthToken', token.token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: true,
      path: '/',
    })
    // ユーザー情報をDB登録する。登録済みの場合はスキップ。
    const userDomain = new UserDomain(c)
    await userDomain.createUser(
      { googleProfileId: googleUser.id ?? null },
      {
        accountId: `${googleUser.email?.split('@')[0].replace(/\./g, '')}`,
        displayName: googleUser.name ?? 'anonymous',
      },
    )

    return next()
  },
}

/**
 * 認証プロバイダーのプロファイルIDを取得する
 */
async function getProfileIds(c: Context) {
  const googleProfileId = await getGoogleProfileId(c)

  return { googleProfileId } as const
}

/**
 * cookieのアクセストークンからGoogle認証情報を取得する
 * https://cloud.google.com/docs/authentication/token-types?hl=ja#access-contents
 */
function getGoogleProfileId(c: Context) {
  const accessToken = getCookie(c, 'googleAuthToken')
  if (!accessToken) {
    return null
  }

  return fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
  )
    .then((res) => res.json() as Promise<{ sub?: string }>)
    .then(({ sub }) => sub ?? null)
    .catch((e) => {
      deleteCookie(c, 'googleAuthToken')
      return null
    })
}
