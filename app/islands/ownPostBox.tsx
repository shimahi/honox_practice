import type { Post, User } from '@/schemas'
import { truncate } from '@/utils'
import { css } from 'hono/css'
import { useState } from 'hono/jsx'

type Props = {
  post: Post & { user?: User }
  /** 全文を表示するか */
  shouldExtend?: boolean
}

export default function OwnPostBox({ post, shouldExtend = false }: Props) {
  const [editing, setEditing] = useState(false)

  const toggleEdit = (e: MouseEvent) => {
    e.preventDefault()
    setEditing((state) => !state)
  }

  return (
    <div
      class={css`
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        background-color: #f9e9d9;
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
        <div>
          <div
            class={css`
              display: flex;
              gap: 10px;
              align-items: center;
            `}
          >
            <button onClick={toggleEdit}>{editing ? '取消' : '編集'}</button>
            <form action={`/posts/${post.id}/delete`} method="post">
              <button type="submit">削除</button>
            </form>
          </div>
        </div>
      </div>
      <div
        class={css`
          padding: 12px 0px;
        `}
      >
        {editing ? (
          <form
            id={`update${post.id}`}
            action={`/posts/${post.id}/update`}
            method="post"
          >
            <div
              class={css`
                display: flex;
                align-items: flex-end;
                gap: 12px;
              `}
            >
              <textarea
                type="text"
                name="content"
                minlength={3}
                defaultValue={post.content}
              />
              <button type="submit">保存</button>
            </div>
          </form>
        ) : (
          <a
            href={`/posts/${post.id}`}
            class={css`
              text-decoration: none;
              color: inherit;
            `}
          >
            {shouldExtend ? post.content : truncate(post.content)}
          </a>
        )}
      </div>
      <div>{post.createdAt.toLocaleString()}</div>
    </div>
  )
}
