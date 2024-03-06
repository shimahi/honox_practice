import { sortByCreatedAt } from '@/utils'

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

import { contextMock, postFixture, userFixture } from '@/__tests__'
import { posts, users } from '@/schemas'
import * as schema from '@/schemas'
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
const db = drizzle(sqlite, { schema })
// DBマイグレーションを実行
migrate(db, { migrationsFolder: 'db/migrations' })
// drizzle-orm/d1モジュールをモック化
mock.module('drizzle-orm/d1', () => ({
  drizzle: jest.fn().mockImplementation(() => db),
}))

// 各テスト終了時にテーブルの中身を空にする
afterEach(async () => {
  await db.delete(posts).run()
  await db.delete(users).run()
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
    const newUsers = new Array(5).fill(0).map(() => userFixture.build())
    const newPosts = new Array(30).fill(0).map(() =>
      postFixture.build({
        createdAt: faker.date.past(),
        userId: newUsers[Math.floor(Math.random() * newUsers.length)].id,
      }),
    )

    beforeEach(async () => {
      await db.insert(users).values(newUsers)
      await db.insert(posts).values(newPosts)
    })
    test('createdAtの新しい順に最初の10件が取得されること', async () => {
      const subject = new PostRepository(contextMock.env.DB)
      const result = await subject.paginatePosts()

      expect(result.length).toEqual(10)
      result.forEach((post, index, result) => {
        expect(
          post.createdAt >
            (result[index + 1]?.createdAt ?? new Date('1970-01-01')),
        ).toBeTruthy()
        expect(result[index].id).toEqual(sortByCreatedAt(newPosts)[index].id)
      })
    })
  })
  describe('offsetパラメータを指定した場合', () => {
    const newUsers = new Array(5).fill(0).map(() => userFixture.build())
    const newPosts = new Array(30).fill(0).map(() =>
      postFixture.build({
        createdAt: faker.date.past(),
        userId: newUsers[Math.floor(Math.random() * newUsers.length)].id,
      }),
    )

    beforeEach(async () => {
      await db.insert(users).values(newUsers)
      await db.insert(posts).values(newPosts)
    })
    test('offsetを始点にした10件が取得されること', async () => {
      const subject = new PostRepository(contextMock.env.DB)
      const result = await subject.paginatePosts({ offset: 10 })
      expect(result.length).toEqual(10)
      expect(result.map(({ id }) => id)).toEqual(
        sortByCreatedAt(newPosts)
          .slice(10, 20)
          .map(({ id }) => id),
      )
    })
  })
})

describe('#paginatePostsByUserId', () => {
  const userId = faker.string.alphanumeric()
  const otherUserId = faker.string.alphanumeric()
  describe('パラメータが指定されていない場合', () => {
    const newPosts = new Array(50).fill(10).map((_, index) =>
      postFixture.build({
        userId: index % 2 === 0 ? userId : otherUserId,
        createdAt: faker.date.past(),
      }),
    )

    beforeEach(async () => {
      await db.insert(posts).values(newPosts)
    })
    test('ユーザーIDの一致する最初の10件が取得されること', async () => {
      const subject = new PostRepository(contextMock.env.DB)
      const result = await subject.paginatePostsByUserId(userId)

      result.forEach((post, index, result) => {
        expect(post.userId).toEqual(userId)
        expect(post.userId).not.toEqual(otherUserId)
        expect(
          post.createdAt >
            (result[index + 1]?.createdAt ?? new Date('1970-01-01')),
        ).toBeTruthy()
      })
    })
  })
})

describe('#getPost', () => {
  const userData = userFixture.build()
  const postData = postFixture.build({
    userId: userData.id,
  })

  beforeEach(async () => {
    await db.insert(users).values(userData)
    await db.insert(posts).values(postData)
  })

  describe('入力パラメータが正常な場合', () => {
    const subject = new PostRepository(contextMock.env.DB)
    test('指定したIDのポストが変えること', async () => {
      const result = await subject.getPost(postData.id)

      expect(result).toEqual({
        ...postData,
        user: userData,
      })
    })
  })
  describe('指定したIDのポストが存在しない場合', () => {
    const subject = new PostRepository(contextMock.env.DB)
    test('undefinedが返されること', async () => {
      const result = await subject.getPost(faker.string.alphanumeric())

      expect(result).toBeUndefined()
    })
  })
})
describe('#updatePost', () => {
  const userData = userFixture.build()
  const postData = postFixture.build({
    userId: userData.id,
  })

  beforeEach(async () => {
    await db.insert(users).values(userData)
    await db.insert(posts).values(postData)
  })
  test('ポストレコードが更新されること', async () => {
    const subject = new PostRepository(contextMock.env.DB)
    const updatedPost = await subject.updatePost(postData.id, {
      content: faker.lorem.sentence(),
    })
    const result = await subject.getPost(postData.id)

    expect(result).toEqual({ ...updatedPost, user: userData })
  })
})

describe('#deletePost', () => {
  const postData = postFixture.build()

  beforeEach(async () => {
    const subject = new PostRepository(contextMock.env.DB)
    await subject.createPost(postData)
  })
  test('ポストレコードが削除されること', async () => {
    const subject = new PostRepository(contextMock.env.DB)
    await subject.deletePost(postData.id)
    const result = await subject.getPost(postData.id)

    expect(result).toBeUndefined()
  })
})
