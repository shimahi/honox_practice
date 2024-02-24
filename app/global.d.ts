import {} from 'hono'

type Head = {
  title?: string
  hasScript?: boolean
}

declare module 'hono' {
  interface Env {
    Bindings: {
      DB: D1Database
      NAME: string
      GOOGLE_AUTH_CALLBACK_URL: string
      GOOGLE_AUTH_CLIENT_ID: string
      GOOGLE_AUTH_CLIENT_SECRET: string
    }
    Variables: {
      currentUser: User
    }
  }
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>
  }
}

export type Context = import('hono').Context<import('hono').Env>
