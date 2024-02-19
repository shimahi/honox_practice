import { css } from 'hono/css'
import { useState } from 'hono/jsx'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div
      class={css`
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
      `}
    >
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <br />
    </div>
  )
}
