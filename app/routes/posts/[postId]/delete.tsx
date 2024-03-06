import { PostDomain } from '@/domains/post'
import { authMiddlewares } from '@/middlewares/auth'
import { permissionMiddlewares } from '@/middlewares/permission'
import { postValidator } from '@/validators/post'
import { zValidator } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'
import { createRoute } from 'honox/factory'

export const POST = createRoute(
  zValidator('param', postValidator.delete, ({ success }) => {
    if (!success) {
      throw new HTTPException(400, { message: 'Bad Request' })
    }
  }),
  authMiddlewares.authorizeWithError,
  permissionMiddlewares.post,
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
