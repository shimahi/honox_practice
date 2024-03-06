import { PostDomain } from '@/domains/post'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { postValidator } from '@/validators/post'
import { zValidator } from '@hono/zod-validator'
import { env } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import { createRoute } from 'honox/factory'
import Top from '../../components/templates/top'

export const POST = createRoute(
  authMiddlewares.authorizeWithError,
  zValidator('form', postValidator.create, async (result, c) => {
    if (!result.success) {
      const currentUser = c.get('currentUser')
      const postDomain = new PostDomain(c)
      const posts = await postDomain.pagenatePosts()

      return c.render(
        createElement(Top, {
          currentUser,
          posts,
          name: env(c).NAME,
          formError: result.error,
        }),
        {
          title: 'Hono Test App',
        },
      )
    }
  }),
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
