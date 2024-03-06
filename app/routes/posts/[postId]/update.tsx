import { PostDomain } from '@/domains/post'
import { authMiddlewares } from '@/middlewares/auth'
import { permissionMiddlewares } from '@/middlewares/permission'
import { postValidator } from '@/validators/post'
import { zValidator } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'
import { createRoute } from 'honox/factory'

export const POST = createRoute(
  zValidator('form', postValidator.update, (result, c) => {
    if (!result.success) {
      c.set('formError', result.error)

      return c.redirect('/')
    }
  }),
  authMiddlewares.authorizeWithError,
  permissionMiddlewares.post,
  (c) => {
    const { postId } = c.req.param()
    const postDomain = new PostDomain(c)
    const inputs = c.req.valid('form')

    return postDomain
      .updatePost(postId, inputs)
      .then(() => c.redirect('/'))
      .catch(() => {
        throw new HTTPException(500, { message: 'Internal Server Error' })
      })
  },
)
