import UserDetail from '@/components/templates/userDetail'
import { PostDomain } from '@/domains/post'
import { UserDomain } from '@/domains/user'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.get('/:userId', authMiddlewares.authorize, async (c) => {
  const currentUser = c.get('currentUser')

  const { userId } = c.req.param()
  const userDomain = new UserDomain(c)
  const user = await userDomain.getUser(userId)
  const postDomain = new PostDomain(c)
  const posts = await postDomain.paginatePostsByUserId(userId)

  if (!user) {
    throw new HTTPException(404, { message: 'User Not Found' })
  }

  return c.render(createElement(UserDetail, { currentUser, user, posts }), {
    title: user.displayName,
  })
})

export default app
