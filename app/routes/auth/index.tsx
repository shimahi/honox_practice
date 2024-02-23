import { AuthService } from '@/services/auth'
import { Hono } from 'hono'

const app = new Hono()

app.get('/google', c => {
  const authService = new AuthService(c)
  authService.authenticateWithGoogle()

  console.log('いぬ')
  return c.render(<h1>Google!</h1>)
})
app.get('/google/callback', c => {
  return c.render(<h1>Google!callback</h1>)
})

export default app
