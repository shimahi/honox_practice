import { Database } from 'bun:sqlite'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  jest,
  mock,
  test,
} from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'

import { ContextMock, userFixture } from '@app/__tests__'
import { UserRepository } from '@app/repositories/user'
import { users } from '@schemas'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// SQLiteの仮想DBをメモリ上に作成
const sqlite = new Database(':memory:')
// drizzleオブジェクトの作成
const db = drizzle(sqlite)
// DBマイグレーションを実行
migrate(db, { migrationsFolder: 'db/migrations' })
// drizzle-orm/d1モジュールをモック化
mock.module('drizzle-orm/d1', () => ({
  drizzle: jest.fn().mockImplementation(() => db),
}))

// 各テスト終了時にテーブルの中身を空にする
afterEach(() => {
  db.delete(users).run()
})

// 全テスト終了後、メモリ内の仮想DBを削除
afterAll(() => {
  sqlite.prepare('DROP TABLE users').run()
  sqlite.close()
  mock.restore()
  jest.restoreAllMocks()
})

/**
 * =============================
 * テストケースの実装
 * =============================
 */
describe('#getUsers', () => {
  const subject = new UserRepository(ContextMock.env.DB)

  const userData1 = userFixture.build()
  const userData2 = userFixture.build()

  beforeAll(() => {
    db.insert(users).values(userData1).run()
    db.insert(users).values(userData2).run()
  })

  test('すべてのユーザー情報が取得できる', async () => {
    const result = await subject.getUsers()

    expect(result).toEqual([userData1, userData2])
  })
})
