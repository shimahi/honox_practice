import { beforeEach, describe, expect, jest, mock, test } from 'bun:test'
import { contextMock, userFixture, userRepositoryMock } from '@/__tests__'
import { faker } from '@faker-js/faker'
import { UserDomain } from './user'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// UserDomainの依存モジュールをモックする
mock.module('@/repositories/user', () => ({
  UserRepository: jest.fn().mockImplementation(() => userRepositoryMock),
}))

/**
 * =============================
 * テストケースの実装
 * =============================
 */
describe('#getUsers', () => {
  const subject = new UserDomain(contextMock)
  test('repository.getUsersがコールされること', async () => {
    await subject.getUsers()

    expect(userRepositoryMock.getUsers).toHaveBeenCalled()
  })
})

describe('#getUser', () => {
  const subject = new UserDomain(contextMock)
  const userId = faker.string.uuid()
  test('repository.getUserがコールされること', async () => {
    await subject.getUser(userId)

    expect(userRepositoryMock.getUser).toHaveBeenCalledWith(userId)
  })
})

describe('#createUser', () => {
  beforeEach(() => {
    userRepositoryMock.getUserByGoogleProfileId.mockClear()
    userRepositoryMock.createUser.mockClear()
  })

  describe('profileIdの一致するユーザーがすでにいる場合', () => {
    const subject = new UserDomain(contextMock)
    const userData = userFixture.build()

    beforeEach(() => {
      userRepositoryMock.getUserByGoogleProfileId.mockResolvedValue(userData)
    })

    test('repository.createUserはコールされず、そのユーザーを返す', async () => {
      const result = await subject.createUser(
        { googleProfileId: userData.googleProfileId },
        {
          accountId: faker.lorem.word(),
          displayName: faker.person.firstName(),
        },
      )

      expect(userRepositoryMock.createUser).not.toHaveBeenCalled()
      expect(result).toEqual(userData)
    })
  })
  describe('profileIdの一致するユーザーがいない場合', () => {
    const subject = new UserDomain(contextMock)
    const { id, ...userData } = userFixture.build()

    beforeEach(() => {
      userRepositoryMock.getUserByGoogleProfileId.mockResolvedValue(null)
    })

    test('repository.createUserがコールされること', async () => {
      await subject
        .createUser({ googleProfileId: faker.string.uuid() }, userData)
        .catch(() => {})

      expect(userRepositoryMock.createUser).toHaveBeenCalled()
    })
  })
  describe('新規作成時にすでにaccountIdが重複するユーザーがいる場合', () => {
    const subject = new UserDomain(contextMock)
    const userData = userFixture.build()

    beforeEach(() => {
      userRepositoryMock.getUserByGoogleProfileId.mockResolvedValue(null)
      userRepositoryMock.createUser
        .mockRejectedValueOnce(new Error(''))
        .mockResolvedValueOnce(userData)
    })

    test('repository.createUserがaccountIdが重複しないように再度コールされること', async () => {
      await subject.createUser(
        { googleProfileId: userData.googleProfileId },
        userData,
      )
      expect(userRepositoryMock.createUser).toHaveBeenNthCalledWith(1, {
        ...userData,
        id: expect.any(String),
        accountId: expect.any(String),
      })
      expect(userRepositoryMock.createUser).toHaveBeenCalledTimes(2)
    })
  })
})

describe('#getUserByProfileId', () => {
  beforeEach(() => {
    userRepositoryMock.getUserByGoogleProfileId.mockClear()
  })

  describe('profileIdキーにgoogleを指定した場合', () => {
    const subject = new UserDomain(contextMock)
    const googleProfileId = faker.string.uuid()
    test('repository.getUserByGoogleProfileIdがコールされること', async () => {
      await subject.getUserByProfileIds({ googleProfileId })

      expect(userRepositoryMock.getUserByGoogleProfileId).toHaveBeenCalledWith(
        googleProfileId,
      )
    })
  })

  describe('profileIdキーにgoogleを指定しない場合', () => {
    const subject = new UserDomain(contextMock)
    const otherProfileId = faker.string.uuid()
    test('repository.getUserByGoogleProfileIdはコールされないこと', async () => {
      await subject.getUserByProfileIds({
        otherProfileId,
      } as unknown as Parameters<UserDomain['getUserByProfileIds']>[0])

      expect(userRepositoryMock.getUserByGoogleProfileId).not.toHaveBeenCalled()
    })
  })
})
