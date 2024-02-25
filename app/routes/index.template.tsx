import Counter from '@/islands/counter'
import type { User } from '@/schemas'
import { css } from 'hono/css'
import { ErrorBoundary } from 'hono/jsx'

type Props = {
  currentUser: User | null
  users: User[] | null
  name: string
}

export const Template = ({ currentUser, users, name }: Props) => {
  return (
    <div>
      <h2
        class={css`
          font-size: 32px;
          font-weight: bold;
          color: #335;
          font-family: 'hiragino kaku gothic pro', 'ヒラギノ角ゴ Pro W3';
        `}
      >
        User list
      </h2>

      <div>あなたはいまログインしていま{currentUser ? 'す' : 'せん'}</div>
      <div>{!!currentUser && currentUser?.displayName}</div>

      <div
        class={css`
          margin-top: 20px;
          margin-bottom: 20px;
        `}
      >
        {currentUser ? (
          <a href="/auth/logout">ログアウト</a>
        ) : (
          <a href="/auth/google">Googleでログイン</a>
        )}
      </div>

      <div
        class={css`
          display: flex;
          align-items: center;
        `}
      >
        <Counter />
      </div>
      <div>環境変数NAME: {name} </div>
      <div
        class={css`
          margin-top: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          row-gap: 20px;
        `}
      >
        <div>
          <img src="/static/images/ssl.jpg" alt="Steller Sea Lion" />
        </div>
      </div>
      <div
        class={css`
          padding: 20px 10px;
          border: solid 1px #8db;
        `}
      >
        <ErrorBoundary
          fallback={<div>このErrorBoundaryの中でエラーを投げています</div>}
        >
          <ErrorTemplate />
        </ErrorBoundary>
      </div>

      <div>
        {users?.map((u) => (
          <div
            class={css`
              padding: 15px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
              background-color: ${
                currentUser?.id === u.id ? '#f9e9d9' : '#faf8fa'
              };
            `}
            key={u.id}
          >
            <p>id: {u.id}</p>
            <p>accountId: {u.accountId}</p>
            <p>
              name: <b>{u.displayName}</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ErrorTemplate = () => {
  throw new Error('うん')
}
