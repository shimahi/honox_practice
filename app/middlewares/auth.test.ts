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
  userDomainMock,
  userFixture,
} from '@/__tests__'
import { faker } from '@faker-js/faker'
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

describe('#afterSignInWithGoogle', () => {
  const token = { token: 'token' }
  const googleUser = {
    id: faker.lorem.word,
    email: faker.internet.email(),
    name: faker.person.firstName,
  }
  describe('コンテキスト変数にgoogleの認証情報が含まれる場合', () => {
    beforeEach(() => {
      ;(contextMock.get as MockFn).mockReturnValueOnce(token)
      ;(contextMock.get as MockFn).mockReturnValueOnce(googleUser)
    })
    test('Cookieにアクセストークンがセットされ、userDomain.createUserがコールされること', async () => {
      await authMiddlewares.afterSignInWithGoogle(contextMock, nextMock)
      expect(cookieMock.setCookie).toHaveBeenCalledWith(
        contextMock,
        'googleAuthToken',
        token.token,
        {
          httpOnly: true,
          sameSite: 'Lax',
          secure: true,
          path: '/',
        },
      )
      expect(userDomainMock.createUser).toHaveBeenCalledWith(
        { googleProfileId: googleUser.id },
        {
          accountId: `${googleUser.email.split('@')[0].replace(/\./g, '')}`,
          displayName: googleUser.name,
        },
      )
      expect(nextMock).toHaveBeenCalled()
    })
  })
  describe('コンテキスト変数にgoogleのアクセストークンが含まれない場合', () => {
    beforeEach(() => {
      ;(contextMock.get as MockFn).mockReturnValue(undefined)
      ;(contextMock.get as MockFn).mockReturnValueOnce(googleUser)
    })
    test('エラーが投げられること', async () => {
      await expect(
        authMiddlewares.afterSignInWithGoogle(contextMock, nextMock),
      ).rejects.toThrow('Unauthorized')
    })
  })
  describe('コンテキスト変数にユーザー情報が含まれない場合', () => {
    beforeEach(() => {
      ;(contextMock.get as MockFn).mockReturnValue(token)
      ;(contextMock.get as MockFn).mockReturnValue(undefined)
    })
    test('エラーが投げられること', async () => {
      const next = jest.fn()
      await expect(
        authMiddlewares.afterSignInWithGoogle(contextMock, next),
      ).rejects.toThrow('Unauthorized')
    })
  })
})
