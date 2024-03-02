import { UserDomain } from '@/domains/user'
import type { Context } from '@/global'
import type { User } from '@/schemas'

import { googleAuth } from '@hono/oauth-providers/google'
import type { Next } from 'hono'
import { env } from 'hono/adapter'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

export const authMiddlewares = {
  /**
   * ログインユーザーを確認するミドルウェア
   */
  async authorize(c: Context, next: Next) {
    await authorize(c)

    return next()
  },
  /**
   * authorizeと同じ処理だが、
   * ログインしていない場合にエラーを投げる
   */
  async authorizeWithError(c: Context, next: Next) {
    const user = await authorize(c)

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

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
  async signInWithGoogle(c: Context, next: Next) {
    const handler = await googleAuth({
      client_id: env(c).GOOGLE_AUTH_CLIENT_ID,
      client_secret: env(c).GOOGLE_AUTH_CLIENT_SECRET,
      scope: ['openid', 'email', 'profile'],
    })

    return handler(c, next)
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
    // ユーザー情報を取得(新規の場合は登録)する
    const userDomain = new UserDomain(c)
    const user = await userDomain.createUser(
      { googleProfileId: googleUser.id ?? null },
      {
        accountId: `${googleUser.email?.split('@')[0].replace(/\./g, '')}`,
        displayName: googleUser.name ?? 'anonymous',
      },
    )

    c.set('currentUser', user)

    return next()
  },
}

/**
 * 認証プロバイダーのプロファイルIDを取得する
 */
async function getProfileIds(c: Context) {
  const googleProfileId = await getGoogleProfileId(
    getCookie(c, 'googleAuthToken'),
  )?.catch(() => deleteCookie(c, 'googleAuthToken'))

  return { googleProfileId } as const
}

/**
 * cookieのアクセストークンからGoogle認証情報を取得する
 * https://cloud.google.com/docs/authentication/token-types?hl=ja#access-contents
 */
function getGoogleProfileId(accessToken: string | undefined) {
  if (!accessToken) {
    return null
  }

  return fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
  )
    .then((res) => res.json() as Promise<{ sub?: string }>)
    .then(({ sub }) => sub ?? null)
}

/**
 * 現在のログインユーザーを返す
 * cookieが保持しているアクセストークンから認証状態を確認し、コンテキストにユーザー情報をセットする
 */
export async function authorize(c: Context): Promise<User | null> {
  if (c.get('currentUser')) return c.get('currentUser')

  const userDomain = new UserDomain(c)
  const user =
    (await userDomain.getUserByProfileIds(await getProfileIds(c))) ?? null

  if (user) {
    c.set('currentUser', user)
  }
  return user
}
