/**
 * @description
 * ローカルのsqliteにダミーデータを挿入する
 * $ bun seed:dev
 */

import { Database } from 'bun:sqlite'
import { userFixture } from '@/__tests__'
import type { User } from '@/schemas/type'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import { users } from './schemas'

import * as fs from 'fs'
import * as path from 'path'

const SQLITE_DIR = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'

// .wrangler下の.sqliteのパスを取得
const filePath = await fs.promises.readdir(SQLITE_DIR).then(files => {
  const sqliteFiles = files.filter(file => path.extname(file) === '.sqlite')
  if (!sqliteFiles.length) throw new Error('No sqlite files found')

  return `${SQLITE_DIR}/${sqliteFiles[0]}`
})

// drizzleオブジェクト作成
const db = drizzle(new Database(filePath))

console.log('Seeding Started...')

// Userのダミーデータを挿入
const newUsers: User[] = new Array(10).fill(0).map(() => userFixture.build())
await db.insert(users).values(newUsers)

console.log('Seeding Completed!')
