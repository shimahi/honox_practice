import { PostDomain } from '@/domains/post'
import { UserDomain } from '@/domains/user'
import { createElement } from '@/middlewares'
import { authMiddlewares } from '@/middlewares/auth'
import { HTTPException } from 'hono/http-exception'
import { createRoute } from 'honox/factory'
import UserDetail from '../../../components/templates/userDetail'

export default createRoute(authMiddlewares.authorize, async (c) => {
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
