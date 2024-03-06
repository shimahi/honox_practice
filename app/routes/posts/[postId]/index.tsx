import { PostDomain } from '@/domains/post'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { HTTPException } from 'hono/http-exception'
import { createRoute } from 'honox/factory'
import PostDetail from './../../../components/templates/postDetail'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const currentUser = c.get('currentUser')

  const { postId } = c.req.param()
  const postDomain = new PostDomain(c)
  const post = await postDomain.getPost(postId)

  if (!post) {
    throw new HTTPException(404, { message: 'Not Found' })
  }

  return c.render(
    createElement(PostDetail, {
      currentUser,
      post,
    }),
    {
      title: '投稿詳細',
    },
  )
})
