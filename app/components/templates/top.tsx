import PostBox from '@/components/features/postBox'
import Header from '@/components/header'
import Counter from '@/islands/counter'
import OwnPostBox from '@/islands/ownPostBox'
import type { Post, User } from '@/schemas'
import { css } from 'hono/css'
import { HasIslands } from 'honox/server'

type Props = {
  currentUser: User | null
  posts: Post[]
  name: string
}

export default function Top({ currentUser, posts, name }: Props) {
  return (
    <>
      <HasIslands>
        <h1>Has Island</h1>
      </HasIslands>

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
        <dir>
          <form action="/posts/create" method="post">
            {/* TODO: islandsに設定 */}
            <textarea type="text" name="content" />
            <button type="submit">送信</button>
          </form>
        </dir>
        <Counter />
        <div
          class={css`
            margin-top: 36px;
          `}
        >
          {posts?.map((post) =>
            post.userId === currentUser?.id ? (
              <OwnPostBox post={post} />
            ) : (
              <PostBox post={post} />
            ),
          )}
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
        環境変数NAME: {name}
      </div>
    </>
  )
}
