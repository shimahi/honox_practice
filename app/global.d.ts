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
