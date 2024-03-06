import Header from '@/components/header'
import OwnPostBox from '@/islands/ownPostBox'
import type { Post, User } from '@/schemas'
import { css } from 'hono/css'
import PostBox from '../features/postBox'

type Props = {
  post: Post & { user?: User }
  currentUser: User | null
}

export default function PostDetail({ post, currentUser }: Props) {
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
        {post.userId === currentUser?.id ? (
          <OwnPostBox post={post} shouldExtend />
        ) : (
          <PostBox post={post} shouldExtend />
        )}
      </div>
    </>
  )
}
