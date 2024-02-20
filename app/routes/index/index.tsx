import { UserDomain } from '@app/domains/user'
import Counter from '@app/islands/counter'
import { env } from 'hono/adapter'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'

export default createRoute(async c => {
  const userDomain = new UserDomain(c)
  const users = await userDomain.getUsers()

  const { NAME } = env(c)

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
      <Counter />
      <h3
        class={css`
          margin-bottom: 20px;
        `}
      >
        env name: {NAME}{' '}
      </h3>
      <div>
        {users?.map(u => (
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
