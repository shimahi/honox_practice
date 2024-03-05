import Top from '@/components/templates/top'
import { PostDomain } from '@/domains/post'
import { authMiddlewares } from '@/middlewares/auth'
import { env } from 'hono/adapter'
import { createRoute } from 'honox/factory'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const currentUser = c.get('currentUser')

  const postDomain = new PostDomain(c)
  const posts = await postDomain.pagenatePosts()
  return c.render(
    <>
      <Top {...{ currentUser, posts, envName: env(c).NAME }} />
    </>,
    {
      title: 'Hono Test App',
    },
  )
})
