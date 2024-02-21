import pages from '@hono/vite-cloudflare-pages'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { type UserConfig, defineConfig } from 'vite'
import { getPlatformProxy } from 'wrangler'

export default defineConfig(async ({ mode }) => {
  const { env, dispose } = await getPlatformProxy()

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
      build: {
        rollupOptions: {
          input: ['/app/style.css'],
          output: {
            assetFileNames: 'static/[name].[ext]',
          },
        },
      },
      plugins: [client()],
    }
  }
  return {
    ...common,
    plugins: [
      honox({
        devServer: {
          env,
          plugins: [
            {
              onServerClose: dispose,
            },
          ],
        },
      }),
      pages(),
    ],
  }
})
