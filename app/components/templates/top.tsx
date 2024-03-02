import PostBox from '@/components/features/postBox'
import Header from '@/components/header'
import type { Post, User } from '@/schemas'
import { css } from 'hono/css'

type Props = {
  posts: Post[]
  currentUser: User | null
  envName: string
}

export default function Top({ posts, currentUser, envName }: Props) {
  return (
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
        <dir>
          <form action="/posts/create" method="post">
            {/* TODO: islandsに設定 */}
            <textarea type="text" name="content" />
            <button type="submit">送信</button>
          </form>
        </dir>

        <div
          class={css`
            margin-top: 36px;
          `}
        >
          {posts?.map((post) => (
            <PostBox post={post} currentUser={currentUser} />
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
        環境変数NAME: {envName}
      </div>
    </>
  )
}
