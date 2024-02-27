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
import { contextMock, nextMock, userDomainMock, userFixture } from '@/__tests__'
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
    beforeEach(() => {
      userDomainMock.getUserByProfileIds.mockResolvedValue(user)
    })
    afterEach(() => userDomainMock.getUserByProfileIds.mockClear())
    test('コンテキスト変数にユーザー情報がセットされること', async () => {
      await authMiddlewares.authorize(contextMock, nextMock)

      expect(contextMock.set).toHaveBeenCalledWith('currentUser', user)
      expect(nextMock).toHaveBeenCalled()
    })
  })
})
describe('#authorizeWithError', () => {
  describe('Cookieにアクセストークンが含まれ、該当するユーザーがDBに含まれる場合', () => {
    const user = userFixture.build()
    beforeEach(() => {
      userDomainMock.getUserByProfileIds.mockResolvedValue(user)
    })
    afterEach(() => userDomainMock.getUserByProfileIds.mockClear())
    test('コンテキスト変数にユーザー情報がセットされること', async () => {
      await authMiddlewares.authorizeWithError(contextMock, nextMock)

      expect(contextMock.set).toHaveBeenCalledWith('currentUser', user)
      expect(nextMock).toHaveBeenCalled()
    })
  })
  describe('Cookieにアクセストークンが含まれ、該当するユーザーがDBに含まれない場合', () => {
    beforeEach(() => {
      userDomainMock.getUserByProfileIds.mockResolvedValue(null)
    })
    afterEach(() => userDomainMock.getUserByProfileIds.mockClear())
    test('エラーが投げられること', async () => {
      await expect(
        authMiddlewares.authorizeWithError(contextMock, nextMock),
      ).rejects.toThrow('Unauthorized')
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
