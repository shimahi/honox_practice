import Header from '@/components/header'
import { PostDomain } from '@/domains/post'
import Counter from '@/islands/counter'
import { authMiddlewares } from '@/middlewares/auth'
import { env } from 'hono/adapter'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'

export default createRoute(authMiddlewares.authorize, async (c) => {
  const postDomain = new PostDomain(c)
  const posts = await postDomain.pagenatePosts()
  const currentUser = c.get('currentUser')

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
        <div
          class={css`
            display: flex;
            align-items: center;
          `}
        >
          <Counter />
        </div>

        <div>
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
              <p
                class={css`
                  font-size: 14px;
                  margin-bottom: 8px;
                  color: #668;
                `}
              >
                id: {post.id}
              </p>
              <p> {post.content}</p>
              <p>{post.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
      <hr />

      <div
        class={css`
          padding: 20px 0;
          max-width: 960px;
          margin-inline: auto;
          padding-inline: 16px;
        `}
      >
        環境変数NAME: {env(c).NAME}{' '}
      </div>
    </>,
    {
      title: 'Hono Practice',
    },
  )
})
