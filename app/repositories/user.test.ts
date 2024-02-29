import { Database } from 'bun:sqlite'
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  mock,
  test,
} from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'

import { contextMock, userFixture } from '@/__tests__'
import { UserRepository } from '@/repositories/user'
import { users } from '@/schemas'
import * as schema from '@/schemas'

import { faker } from '@faker-js/faker'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// SQLiteの仮想DBをメモリ上に作成
const sqlite = new Database(':memory:')
// drizzleオブジェクトの作成
const db = drizzle(sqlite, { schema })
// DBマイグレーションを実行
migrate(db, { migrationsFolder: 'db/migrations' })
// drizzle-orm/d1モジュールをモック化
mock.module('drizzle-orm/d1', () => ({
  drizzle: jest.fn().mockImplementation(() => db),
}))

// 各テスト終了時にテーブルの中身を空にする
afterEach(async () => {
  await db.delete(users).run()
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

describe('#createUser', () => {
  const subject = new UserRepository(contextMock.env.DB)
  const userData = userFixture.build()
  describe('入力パラメータが正常な場合', () => {
    test('ユーザーレコードが作成されること', async () => {
      const result = await subject.createUser(userData)

      expect(result).toEqual(userData)
    })
  })
  describe('accountIdが重複している場合', () => {
    const userData1 = userFixture.build()
    const userData2 = userFixture.build({
      accountId: userData1.accountId,
    })

    beforeEach(async () => {
      await db.insert(users).values(userData1).run()
    })

    test('エラーが投げられること', async () => {
      expect(() => subject.createUser(userData2)).toThrow()
    })
  })
})

describe('#getUsers', () => {
  const subject = new UserRepository(contextMock.env.DB)

  const userData1 = userFixture.build()
  const userData2 = userFixture.build()

  beforeEach(async () => {
    await db.insert(users).values(userData1).run()
    await db.insert(users).values(userData2).run()
  })

  test('すべてのユーザー情報が取得できる', async () => {
    const result = await subject.getUsers()

    expect(result).toEqual([userData1, userData2])
  })
})

describe('#getUser', () => {
  const userId = faker.string.uuid()
  const userData1 = userFixture.build()
  const userData2 = userFixture.build()
  const target = userFixture.build({
    id: userId,
  })
  beforeEach(async () => {
    await db.insert(users).values(userData1).run()
    await db.insert(users).values(userData2).run()
    await db.insert(users).values(target).run()
  })

  test('ユーザーIDからユーザー情報が取得できる', async () => {
    const subject = new UserRepository(contextMock.env.DB)
    const result = await subject.getUser(userId)

    expect(result).toEqual(target)
  })
})

describe('#getUserByGoogleProfileId', () => {
  const subject = new UserRepository(contextMock.env.DB)
  const googleProfileId = faker.string.uuid()

  const userData1 = userFixture.build()
  const userData2 = userFixture.build()
  const target = userFixture.build({
    googleProfileId,
  })
  beforeEach(async () => {
    await db.insert(users).values(userData1).run()
    await db.insert(users).values(userData2).run()
    await db.insert(users).values(target).run()
  })

  test('GoogleプロファイルIDからユーザー情報が取得できる', async () => {
    const result = await subject.getUserByGoogleProfileId(googleProfileId)

    expect(result).toEqual(target)
  })
})
