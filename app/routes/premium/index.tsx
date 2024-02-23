import { createRoute } from 'honox/factory'

export default createRoute(
  // ミドルウェアをハンドラーの前に追加している
  async (c, next) => {
    console.log('hello')
    const bool = true
    if (bool) return c.render(<h1>残念ながら。。。</h1>)
    await next()
  },
  c => {
    return c.render(<h1>Hello!</h1>)
  },
)
