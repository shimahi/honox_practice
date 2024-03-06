import { PostDomain } from '@/domains/post'
import { authMiddlewares } from '@/middlewares/auth'
import { postValidator } from '@/validators/post'
import { zValidator } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'
import { createRoute } from 'honox/factory'

export const POST = createRoute(
  zValidator('form', postValidator.create, ({ success }) => {
    if (!success) {
      throw new HTTPException(400, { message: 'Bad Request' })
    }
  }),
  authMiddlewares.authorizeWithError,
  (c) => {
    const currentUser = c.get('currentUser')
    const inputs = c.req.valid('form')
    const postDomain = new PostDomain(c)

    return postDomain
      .createPost(currentUser.id, inputs)
      .then(() => c.redirect('/'))
      .catch(() => {
        throw new HTTPException(500, { message: 'Internal Server Error' })
      })
  },
)
