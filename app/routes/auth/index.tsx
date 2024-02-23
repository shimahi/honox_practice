import { Hono } from 'hono'

const app = new Hono()

app.get('/google', c => {
  return c.render(<h1>Google!</h1>)
})
app.get('/google/callback', c => {
  return c.render(<h1>Google!callback</h1>)
})

export default app
