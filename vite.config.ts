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
    // ESMでは動かないパッケージを記述し、バックエンドでのみ実行するように設定
    ssr: {
      external: ['google-auth-library'],
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
