import { UserDomain } from '@/domains/user'
import Counter from '@/islands/counter'
import { OAuth2Client } from 'google-auth-library'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { getCookie } from 'hono/cookie'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'

const app = new Hono()

app.get('/auth/google', (c) => {
  return c.render(<h1>Google Auth</h1>)
})

export default createRoute(async (c) => {
  const userDomain = new UserDomain(c)
  const users = await userDomain.getUsers()

  const token = getCookie(c, 'googleAuthToken')

  if (token) {
    const authClient = new OAuth2Client()
    const tokenInfo = await authClient.getTokenInfo(token)

    console.log({ tokenInfo })
  }

  return c.render(
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
      <div
        class={css`
          display: flex;
          align-items: center;
        `}
      >
        <Counter />
        <h3>env name: {env(c).NAME} </h3>
      </div>
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
        <div>
          <img src="/static/images/ssl2.jpg" alt="Steller Sea Lion" />
        </div>
        <div>
          <img src="/static/images/ssl3.jpg" alt="Steller Sea Lion" />
        </div>
      </div>
      <div
        class={css`
          margin-top: 20px;
          margin-bottom: 20px;
        `}
      >
        <a href="/auth/google">Googleでログイン</a>
      </div>
      <div>
        {users?.map((u) => (
          <div
            class={css`
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
            `}
            key={u.id}
          >
            <p>id: {u.id}</p>
            <p>accountId: {u.accountId}</p>
            <p>
              name: <b>{u.name}</b>
            </p>
          </div>
        ))}
      </div>
    </div>,
    {
      title: 'Hono Blog',
    },
  )
})
