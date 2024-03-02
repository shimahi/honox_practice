import PostDetail from '@/components/templates/postDetail'
import { PostDomain } from '@/domains/post'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.get('/:postId', authMiddlewares.authorize, async (c) => {
  const user = c.get('currentUser')

  const { postId } = c.req.param()
  const postDomain = new PostDomain(c)
  const post = await postDomain.getPost(postId)

  if (!post) {
    throw new HTTPException(404, { message: 'Not Found' })
  }

  return c.render(createElement(PostDetail, { post, currentUser: user }), {
    title: '投稿詳細',
  })
})

app.post('/create', authMiddlewares.authorizeWithError, async (c) => {
  const user = c.get('currentUser')

  const parsedBody = await c.req.parseBody<{ content: string }>()
  const postDomain = new PostDomain(c)

  return postDomain
    .createPost(user.id, parsedBody)
    .then(() => c.redirect('/'))
    .catch(() => {
      throw new HTTPException(500, { message: 'Internal Server Error' })
    })
})

app.post('/:postId/delete', authMiddlewares.authorizeWithError, async (c) => {
  const { postId } = c.req.param()
  const postDomain = new PostDomain(c)

  return postDomain
    .deletePost(postId)
    .then(() => c.redirect('/'))
    .catch(() => c.redirect('/'))
})

export default app
