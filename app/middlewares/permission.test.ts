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
import {
  type MockFn,
  contextMock,
  nextMock,
  postDomainMock,
  postFixture,
  userFixture,
} from '@/__tests__'
import { faker } from '@faker-js/faker'
import { permissionMiddlewares } from './permission'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// 依存モジュールをモックする
mock.module('@/domains/post', () => ({
  PostDomain: jest.fn().mockImplementation(() => postDomainMock),
}))

afterAll(() => {
  mock.restore()
  jest.restoreAllMocks()
})

/**
 * =============================
 * テストケースの実装
 * =============================
 */
describe('#post', () => {
  describe('リクエストパラメータにpostIdが含まれない場合', () => {
    beforeEach(() => {
      ;(contextMock.req.param as MockFn).mockReturnValue({})
    })

    test('エラーが投げられること', async () => {
      await expect(
        permissionMiddlewares.post(contextMock, nextMock),
      ).rejects.toThrow('Bad Request')
    })
  })

  describe('リクエストパラメータにpostIdが含まれる場合', () => {
    const postId = faker.string.alphanumeric()
    const user = userFixture.build()

    beforeEach(() => {
      ;(contextMock.req.param as MockFn).mockReturnValue({ postId })
      ;(contextMock.get as MockFn).mockReturnValue(user)
    })

    describe('ユーザーが認証できなかった場合', () => {
      beforeEach(() => {
        ;(contextMock.get as MockFn).mockReturnValue(null)
      })
      afterEach(() => (contextMock.get as MockFn).mockClear())

      test('エラーが投げられること', async () => {
        await expect(
          permissionMiddlewares.post(contextMock, nextMock),
        ).rejects.toThrow('Unauthorized')
      })
    })

    describe('ユーザーのIDとポストのUserIDが一致する場合', () => {
      const post = postFixture.build({ id: postId, userId: user.id })
      beforeEach(() => {
        postDomainMock.getPost.mockResolvedValue(post)
      })
      afterEach(() => postDomainMock.getPost.mockClear())

      test('next関数が呼ばれること', async () => {
        await permissionMiddlewares.post(contextMock, nextMock)
        expect(nextMock).toHaveBeenCalled()
      })
    })

    describe('ユーザーのIDとポストのUserIDが一致しない場合', () => {
      const post = postFixture.build({
        id: postId,
        userId: faker.string.alphanumeric(),
      })
      beforeEach(() => {
        postDomainMock.getPost.mockResolvedValue(post)
      })
      afterEach(() => postDomainMock.getPost.mockClear())

      test('エラーが投げられること', async () => {
        await expect(
          permissionMiddlewares.post(contextMock, nextMock),
        ).rejects.toThrow('Forbidden')
      })
    })

    describe('該当するポストがDBに含まれない場合', () => {
      beforeEach(() => {
        postDomainMock.getPost.mockResolvedValue(null)
      })
      afterEach(() => postDomainMock.getPost.mockClear())

      test('エラーが投げられること', async () => {
        await expect(
          permissionMiddlewares.post(contextMock, nextMock),
        ).rejects.toThrow('Forbidden')
      })
    })
  })
})
