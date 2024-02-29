import Header from '@/components/header'
import { PostDomain } from '@/domains/post'
import { UserDomain } from '@/domains/user'
import { authMiddlewares } from '@/middlewares/auth'
import { truncate } from '@/utils'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const { userId } = c.req.param()
  const userDomain = new UserDomain(c)
  const user = await userDomain.getUser(userId)

  const postDomain = new PostDomain(c)
  const posts = await postDomain.paginatePostsByUserId(userId)
  const currentUser = c.get('currentUser')

  if (!user)
    return c.render(
      <>
        <Header currentUser={currentUser} />
        <div
          class={css`
            max-width: 960px;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            padding-top: 1rem;
            padding-bottom: 2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            @media (min-width: 640px) {
              padding-left: 2rem;
              padding-right: 2rem;
            }
          `}
        >
          <h3>ユーザーが見つかりません</h3>
        </div>
      </>,
    )

  return c.render(
    <>
      <Header currentUser={currentUser} />
      <div
        class={css`
          max-width: 960px;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          padding-top: 1rem;
          padding-bottom: 2rem;
          padding-left: 1rem;
          padding-right: 1rem;
          @media (min-width: 640px) {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        `}
      >
        <p>{user.accountId}</p>
        <h3>{user.displayName}</h3>
        <div
          class={css`
            margin-top: 36px;
          `}
        >
          {posts?.map((post) => (
            <div
              class={css`
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
                background-color: ${
                  currentUser?.id === post.userId ? '#f9e9d9' : '#faf8fa'
                };
              `}
              key={post.id}
            >
              {user.displayName}
              <p> {truncate(post.content)}</p>
              <p>{post.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </>,
    {
      title: 'Hono Practice',
    },
  )
})
