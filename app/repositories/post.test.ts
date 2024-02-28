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

import { contextMock, postFixture } from '@/__tests__'
import { posts, users } from '@/schemas'
import { faker } from '@faker-js/faker'
import { PostRepository } from './post'

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
afterEach(async () => {
  await db.delete(users).run()
  await db.delete(posts).run()
})

// 全テスト終了後、メモリ内の仮想DBを削除
afterAll(() => {
  sqlite.prepare('DROP TABLE users').run()
  sqlite.prepare('DROP TABLE posts').run()
  sqlite.close()
  mock.restore()
  jest.restoreAllMocks()
})

/**
 * =============================
 * テストケースの実装
 * =============================
 */

describe('#createPost', () => {
  const postData = postFixture.build()

  describe('入力パラメータが正常な場合', () => {
    const subject = new PostRepository(contextMock.env.DB)
    test('ポストレコードが作成されること', async () => {
      const result = await subject.createPost(postData)

      expect(result).toEqual(postData)
    })
  })
})

describe('#paginatePosts', () => {
  describe('パラメータが指定されていない場合', () => {
    const newPosts = new Array(50)
      .fill(0)
      .map(() =>
        postFixture.build({
          createdAt: faker.date.past(),
        }),
      )
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    beforeEach(async () => {
      await db.insert(posts).values(newPosts)
    })
    test('最初の10件が取得されること', async () => {
      const subject = new PostRepository(contextMock.env.DB)
      const result = await subject.paginatePosts()

      expect(result).toEqual(
        newPosts
          .slice(0, 10)
          .map((post) => ({ ...post, createdAt: expect.any(Date) })),
      )
    })
    test('createdAtの新しい順に取得されること', async () => {
      const subject = new PostRepository(contextMock.env.DB)
      const result = await subject.paginatePosts()

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].createdAt > result[i + 1].createdAt).toBeTruthy()
      }
    })
  })
  describe('offsetパラメータを指定した場合', () => {
    const newPosts = new Array(50)
      .fill(0)
      .map(() =>
        postFixture.build({
          createdAt: faker.date.past(),
        }),
      )
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    beforeEach(async () => {
      await db.insert(posts).values(newPosts)
    })
    test('offsetから10件が取得されること', async () => {
      const subject = new PostRepository(contextMock.env.DB)
      const result = await subject.paginatePosts({ offset: 10 })

      expect(result).toEqual(
        newPosts
          .slice(10, 20)
          .map((post) => ({ ...post, createdAt: expect.any(Date) })),
      )
    })
  })
})

describe('#getPost', () => {
  const postData = postFixture.build()

  describe('入力パラメータが正常な場合', () => {
    const subject = new PostRepository(contextMock.env.DB)
    test('ポストレコードが作成されること', async () => {
      const createdPost = await subject.createPost(postData)
      const result = await subject.getPost(createdPost.id)

      expect(result).toEqual(createdPost)
    })
  })
})
describe('#updatePost', () => {
  const postData = postFixture.build()

  beforeEach(async () => {
    const subject = new PostRepository(contextMock.env.DB)
    await subject.createPost(postData)
  })
  test('ポストレコードが更新されること', async () => {
    const subject = new PostRepository(contextMock.env.DB)
    const updatedPost = await subject.updatePost(postData.id, {
      content: faker.lorem.sentence(),
    })
    const result = await subject.getPost(postData.id)

    expect(result).toEqual(updatedPost)
  })
})
