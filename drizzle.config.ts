import type { Config } from 'drizzle-kit'

/**
 * ローカルでは、.mf下に作成されたsqliteを使用する
 */
const localConfig: Config = {
  schema: './db/schemas/index.ts',
  out: './db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './.mf/d1/DB/db.sqlite',
  },
}

export default localConfig
