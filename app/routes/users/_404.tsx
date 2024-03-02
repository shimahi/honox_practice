import type { NotFoundHandler } from 'hono'

const handler: NotFoundHandler = (c) => {
  return c.render(<h1>Not Found User!</h1>)
}

export default handler
