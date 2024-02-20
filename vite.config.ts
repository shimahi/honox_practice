import pages from '@hono/vite-cloudflare-pages'
import pagesPlugin from '@hono/vite-dev-server/cloudflare-pages'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { type UserConfig, defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const common: UserConfig = {
    resolve: {
      alias: [
        { find: '@/schemas', replacement: '/db/schemas' },
        { find: '@', replacement: '/app' },
      ],
    },
  }

  if (mode === 'client') {
    return {
      ...common,
      plugins: [client()],
    }
  }
  return {
    ...common,
    plugins: [
      honox({
        devServer: {
          entry: './app/server.ts',
          plugins: [
            pagesPlugin({
              d1Databases: ['DB'],
              d1Persist: true,
            }),
          ],
        },
      }),
      pages(),
    ],
  }
})
