import Header from '@/components/header'
import { PostDomain } from '@/domains/post'
import { authMiddlewares } from '@/middlewares/auth'
import { createRoute } from 'honox/factory'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const { postId } = c.req.param()

  const postDomain = new PostDomain(c)
  const post = await postDomain.getPost(postId)
  const currentUser = c.get('currentUser')

  return c.render(
    <>
      <Header currentUser={currentUser} />
    </>,
    {
      title: 'Hono Practice',
    },
  )
})
