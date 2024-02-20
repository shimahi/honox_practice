/**
 * @description
 * ローカルのsqliteにダミーデータを挿入する
 * $ bun seed:dev
 */

import { Database } from 'bun:sqlite'
import { userFixture } from '@/__tests__'
import type { User } from '@/schemas/type'
import { drizzle } from 'drizzle-orm/bun-sqlite'

const sqlite = new Database('./.mf/d1/DB/db.sqlite')
const db = drizzle(sqlite)

import { users } from './schemas'

console.log('Seeding Started...')

const newUsers: User[] = new Array(10).fill(0).map(() => userFixture.build())

await db.insert(users).values(newUsers)

console.log('Seeding Completed!')
