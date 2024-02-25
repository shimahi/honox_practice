import { UserDomain } from '@/domains/user'
import { authMiddlewares } from '@/middlewares/auth'
import { env } from 'hono/adapter'
import { createRoute } from 'honox/factory'
import { Template } from './index.template'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const userDomain = new UserDomain(c)
  const users = await userDomain.getUsers()
  const currentUser = c.get('currentUser')

  return c.render(
    <Template currentUser={currentUser} users={users} name={env(c).NAME} />,
    {
      title: 'Hono Practice',
    },
  )
})
