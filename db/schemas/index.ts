import { sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type * from './type'

export const users = sqliteTable('users', {
  /** ユーザーのID、登録時にCUIDをランダム生成する */
  id: text('id').primaryKey().notNull().unique(),
  /** ユーザーの作成日時 */
  createdAt: int('createdAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  /** ユーザーの更新日時 */
  updatedAt: int('updatedAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  /** ユーザーの表示用アカウントID、ユニークな半角英数 */
  accountId: text('accountId').notNull().unique(),
  /** ユーザー名 */
  displayName: text('displayName').notNull(),
  /** Google認証のOAuthプロファイルID */
  googleProfileId: text('googleProfileId'),
})

export const posts = sqliteTable('posts', {
  /** ポストのID */
  id: text('id').primaryKey().notNull().unique(),
  /** ユーザーID */
  userId: text('userId').notNull(),
  /** ポストの作成日時 */
  createdAt: int('createdAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  /** ポストの更新日時 */
  updatedAt: int('updatedAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  /** ポストの内容 */
  content: text('content').notNull(),
})
