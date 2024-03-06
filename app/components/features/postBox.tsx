import type { Post, User } from '@/schemas'
import { truncate } from '@/utils'
import { css } from 'hono/css'

type Props = {
  post: Post & { user?: User }
  /** 全文を表示するか */
  shouldExtend?: boolean
}

export default function PostBox({ post, shouldExtend = false }: Props) {
  return (
    <div
      class={css`
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        background-color: '#faf8fa';
      `}
      key={post.id}
    >
      <div
        class={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div>
          {!!post.user && (
            <a href={`/users/${post.userId}`}>{post.user.displayName}</a>
          )}
        </div>
        <div />
      </div>
      <div
        class={css`
          padding: 12px 0px;
        `}
      >
        <a
          href={`/posts/${post.id}`}
          class={css`
            text-decoration: none;
            color: inherit;
          `}
        >
          {shouldExtend ? post.content : truncate(post.content)}
        </a>
      </div>
      <div>{post.createdAt.toLocaleString()}</div>
    </div>
  )
}
