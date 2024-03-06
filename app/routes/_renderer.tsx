import { Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { HasIslands, Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title ? <title>{title}</title> : ''}
        {import.meta.env.PROD ? (
          <link href="/static/style.css" rel="stylesheet" />
        ) : (
          <link href="/app/style.css" rel="stylesheet" />
        )}
        <HasIslands>
          <Script src="/app/client.ts" />
          <meta name="description" content="hasIsland is worked" />
        </HasIslands>
        <Style />
      </head>
      <body>{children}</body>
    </html>
  )
})
