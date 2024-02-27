import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  mock,
  test,
} from 'bun:test'
import { contextMock, userDomainMock, userFixture } from '@/__tests__'
import { authMiddlewares } from './auth'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// 依存モジュールをモックする
mock.module('@/domains/user', () => ({
  UserDomain: jest.fn().mockImplementation(() => userDomainMock),
}))

const cookieMock = {
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}
mock.module('hono/cookie', () => cookieMock)

afterAll(() => {
  mock.restore()
  jest.restoreAllMocks()
})

describe('#authorize', () => {
  describe('Cookieにアクセストークンが含まれ、該当するユーザーがDBに含まれる場合', () => {
    const user = userFixture.build()

    beforeAll(() => {
      userDomainMock.getUserByProfileIds.mockResolvedValue(user)
    })
    test('コンテキスト変数にユーザー情報がセットされること', async () => {
      const next = jest.fn()
      await authMiddlewares.authorize(contextMock, next)

      expect(contextMock.set).toHaveBeenCalledWith('currentUser', user)
      expect(next).toHaveBeenCalled()
    })
  })
})

describe('#signOut', () => {
  test('Cookieからアクセストークンが削除されること', () => {
    const next = jest.fn()
    authMiddlewares.signOut(contextMock, next)
    expect(cookieMock.deleteCookie).toHaveBeenCalledWith(
      contextMock,
      'googleAuthToken',
    )
  })
})
