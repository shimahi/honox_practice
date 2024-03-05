import Top from '@/components/templates/top'
import { PostDomain } from '@/domains/post'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import Counter from '@/islands/counter'
import OwnPostBox from '@/islands/ownPostBox'

const app = new Hono()

app.get('/', authMiddlewares.authorize, async (c) => {
  const currentUser = c.get('currentUser')

  const postDomain = new PostDomain(c)
  const posts = await postDomain.pagenatePosts()

  return c.render(
    createElement(Top, { currentUser, posts, envName: env(c).NAME }),
    { title: 'Hono Test App' },
  )
})

export default app
