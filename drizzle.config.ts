import type { Config } from 'drizzle-kit'

const localConfig: Config = {
  schema: './db/schemas/index.ts',
  out: './db/migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    dbName: 'DB',
  },
}

export default localConfig
