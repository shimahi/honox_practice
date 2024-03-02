import type {} from 'hono'

/** Contextパラメータの型付け */
declare module 'hono' {
  interface Env {
    /** 環境変数キーの定義 env(c)で使用可能 */
    Bindings: {
      DB: D1Database
      NAME: string
      GOOGLE_AUTH_CLIENT_ID: string
      GOOGLE_AUTH_CLIENT_SECRET: string
    }
    /** コンテキスト変数キーの定義　 c.getで使用可能 */
    Variables: {
      currentUser: User
    }
  }
  export interface ContextRenderer {
    (
      content: string | Promise<string>,
      /** c.renderer第二引数のメタ要素の型定義 */
      head?: {
        title?: string
        hasScript?: boolean
      },
    ): Response | Promise<Response>
  }
}

/**
 * Hono ContextにEnv型を追加したもの
 */
export type Context<
  U extends string = undefined,
  // biome-ignore lint/complexity/noBannedTypes:
  K extends Input = {},
> = import('hono').Context<import('hono').Env, U, K>

/** cookieのキー名の定義 hono/cookieのメソッド使用時に型チェックが行われる */
export type CookieKey = {
  googleAuthToken: string
}

// hono/cookieモジュールの各メソッドのキー型がCookieKeyにするようにオーバーライドする処理
declare module 'hono/cookie' {
  export declare const getCookie: {
    (c: Context, key: keyof CookieKey): string | undefined
    (c: Context): Cookie
  }
  export declare const getSignedCookie: {
    (
      c: Context,
      secret: string | BufferSource,
      key: keyof CookieKey,
    ): Promise<string | undefined | false>
    (c: Context, secret: string): Promise<SignedCookie>
  }
  export declare const setCookie: (
    c: Context,
    name: keyof CookieKey,
    value: string,
    opt?: CookieOptions,
  ) => void
  export declare const setSignedCookie: (
    c: Context,
    name: keyof CookieKey,
    value: string,
    secret: string | BufferSource,
    opt?: CookieOptions,
  ) => Promise<void>
  export declare const deleteCookie: (
    c: Context,
    name: keyof CookieKey,
    opt?: CookieOptions,
  ) => void
}

export const { getCookie, setCookie, deleteCookie } = import('hono/cookie')
