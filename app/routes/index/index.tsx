import { PostDomain } from '@/domains/post'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { env } from 'hono/adapter'
import { createRoute } from 'honox/factory'
import Top from '../../components/templates/top'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const currentUser = c.get('currentUser')
  const postDomain = new PostDomain(c)
  const posts = await postDomain.pagenatePosts()

  return c.render(
    createElement(Top, {
      currentUser,
      posts,
      name: env(c).NAME,
    }),
    {
      title: 'Hono Test App',
    },
  )
})
