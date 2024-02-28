import type { User } from '@/schemas'
import { css } from 'hono/css'

type Props = {
  currentUser: User | null
}
export default function Header({ currentUser }: Props) {
  return (
    <header
      class={css`
        padding: 32px 8px;
      `}
    >
      <div
        class={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 960px;
          margin-inline: auto;
          padding-inline: 16px;
          @media (max-width: 640px) {
            flex-direction: column;
            gap: 20px;
          }
        `}
      >
        <div
          class={css`
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            @media (max-width: 640px) {
              flex-direction: column;
            }
          `}
        >
          <div>
            <img
              class={css`
                max-width: 100px;
                @media (max-width: 640px) {
                  max-width: 100%;
                }
              `}
              src="/static/images/ssl.jpg"
              alt="Steller Sea Lion"
            />
          </div>
          <h1
            class={css`
              font-size: 24px;
            `}
          >
            Hono Sample App
          </h1>
        </div>
        <div>
          {currentUser ? (
            <div
              class={css`
                display: flex;
                align-items: center;
                gap: 12px;
              `}
            >
              <p>{currentUser.displayName} さん</p>
              <a href="/auth/logout">ログアウト</a>
            </div>
          ) : (
            <a href="/auth/google">Googleでログイン</a>
          )}
        </div>
      </div>
    </header>
  )
}
