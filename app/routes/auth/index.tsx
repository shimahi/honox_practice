import { authMiddlewares } from '@/middlewares/auth'
import { Hono } from 'hono'

const app = new Hono()

app.get(
  '/google',
  authMiddlewares.signInWithGoogle,
  authMiddlewares.afterSignInWithGoogle,
  (c) => c.redirect('/'),
)

app.get('/logout', authMiddlewares.signOut, (c) => c.redirect('/'))

export default app
