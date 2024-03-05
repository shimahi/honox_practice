import PostDetail from '@/components/templates/postDetail'
import { PostDomain } from '@/domains/post'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { permissionMiddlewares } from '@/middlewares/permission'
import { postValidator } from '@/validators/post'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.get('/:postId', authMiddlewares.authorize, async (c) => {
  const currentUser = c.get('currentUser')

  const { postId } = c.req.param()
  const postDomain = new PostDomain(c)
  const post = await postDomain.getPost(postId)

  if (!post) {
    throw new HTTPException(404, { message: 'Not Found' })
  }

  return c.render(createElement(PostDetail, { post, currentUser }), {
    title: '投稿詳細',
  })
})

app.post(
  '/create',
  zValidator('form', postValidator.create, ({ success }) => {
    if (!success) {
      throw new HTTPException(400, { message: 'Bad Request' })
    }
  }),
  authMiddlewares.authorizeWithError,
  async (c) => {
    const currentUser = c.get('currentUser')

    const parsedBody = await c.req.parseBody<{ content: string }>()
    const postDomain = new PostDomain(c)

    return postDomain
      .createPost(currentUser.id, parsedBody)
      .then(() => c.redirect('/'))
      .catch(() => {
        throw new HTTPException(500, { message: 'Internal Server Error' })
      })
  },
)

app.post(
  '/:postId/update',
  zValidator('form', postValidator.update, ({ success }) => {
    if (!success) {
      throw new HTTPException(400, { message: 'Bad Request' })
    }
  }),
  authMiddlewares.authorizeWithError,
  permissionMiddlewares.post,
  async (c) => {
    const { postId } = c.req.param()
    const postDomain = new PostDomain(c)
    const parsedBody = await c.req.parseBody<{ content: string }>()

    return postDomain
      .updatePost(postId, parsedBody)
      .then(() => c.redirect(`/posts/${postId}`))
      .catch(() => {
        throw new HTTPException(500, { message: 'Internal Server Error' })
      })
  },
)

app.post(
  '/:postId/delete',
  zValidator('param', postValidator.delete, ({ success }) => {
    if (!success) {
      throw new HTTPException(400, { message: 'Bad Request' })
    }
  }),
  authMiddlewares.authorizeWithError,
  permissionMiddlewares.post,
  async (c) => {
    const { postId } = c.req.param()
    const postDomain = new PostDomain(c)

    return postDomain
      .deletePost(postId)
      .then(() => c.redirect('/'))
      .catch(() => {
        throw new HTTPException(500, { message: 'Internal Server Error' })
      })
  },
)

export default app
