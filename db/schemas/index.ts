import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type * from './type'

export const users = sqliteTable('users', {
  /** ユーザーのID、登録時にCUIDをランダム生成する */
  id: text('id').primaryKey().notNull().unique(),
  /** ユーザーの表示用アカウントID、ユニークな半角英数 */
  accountId: text('accountId').notNull().unique(),
  /** ユーザー名 */
  displayName: text('displayName').notNull(),
  /** Google認証のOAuthプロファイルID */
  googleProfileId: text('googleProfileId'),
})
