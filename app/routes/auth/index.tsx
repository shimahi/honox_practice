import { googleAuth } from '@hono/oauth-providers/google'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { setCookie } from 'hono/cookie'

const app = new Hono()

app.get(
  '/google',
  async (c, next) => {
    const handler = googleAuth({
      client_id: env(c).GOOGLE_AUTH_CLIENT_ID,
      client_secret: env(c).GOOGLE_AUTH_CLIENT_SECRET,
      scope: ['openid', 'email', 'profile'],
    })
    return await handler(c, next)
  },
  (c) => {
    const token = c.get('token')?.token

    if (token) {
      setCookie(c, 'googleAuthToken', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: true,
        path: '/',
      })
    }

    return c.redirect('/')
  },
)

export default app
