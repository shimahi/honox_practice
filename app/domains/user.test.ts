import { beforeEach, describe, expect, jest, mock, test } from 'bun:test'
import { contextMock, userDomainMock, userFixture } from '@/__tests__'
import { faker } from '@faker-js/faker'
import { UserDomain } from './user'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// UserDomainの依存モジュールをモックする
mock.module('@/repositories/user', () => ({
  UserRepository: jest.fn().mockImplementation(() => userDomainMock.repository),
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

    expect(userDomainMock.repository.getUsers).toHaveBeenCalled()
  })
})

describe('#createUser', () => {
  beforeEach(() => {
    userDomainMock.repository.getUserByGoogleProfileId.mockClear()
    userDomainMock.repository.createUser.mockClear()
  })

  describe('profileIdの一致するユーザーがすでにいる場合', () => {
    const subject = new UserDomain(contextMock)
    const userData = userFixture.build()

    beforeEach(() => {
      userDomainMock.repository.getUserByGoogleProfileId.mockResolvedValue(
        userData,
      )
    })

    test('repository.createUserはコールされず、そのユーザーを返す', async () => {
      const result = await subject.createUser(
        { googleProfileId: userData.googleProfileId },
        {
          accountId: faker.lorem.word(),
          displayName: faker.person.firstName(),
        },
      )

      expect(userDomainMock.repository.createUser).not.toHaveBeenCalled()
      expect(result).toEqual(userData)
    })
  })
  describe('profileIdの一致するユーザーがいない場合', () => {
    const subject = new UserDomain(contextMock)
    const { id, ...userData } = userFixture.build()

    beforeEach(() => {
      userDomainMock.repository.getUserByGoogleProfileId.mockResolvedValue(null)
    })

    test('repository.createUserがコールされること', async () => {
      await subject
        .createUser({ googleProfileId: faker.string.uuid() }, userData)
        .catch(() => {})

      expect(userDomainMock.repository.createUser).toHaveBeenCalled()
    })
  })
  describe('新規作成時にすでにaccountIdが重複するユーザーがいる場合', () => {
    const subject = new UserDomain(contextMock)
    const userData = userFixture.build()

    beforeEach(() => {
      userDomainMock.repository.getUserByGoogleProfileId.mockResolvedValue(null)
      userDomainMock.repository.createUser
        .mockRejectedValueOnce(new Error(''))
        .mockResolvedValueOnce(userData)
    })

    test('repository.createUserがaccountIdが重複しないように再度コールされること', async () => {
      await subject.createUser(
        { googleProfileId: userData.googleProfileId },
        userData,
      )
      expect(userDomainMock.repository.createUser).toHaveBeenNthCalledWith(1, {
        ...userData,
        id: expect.any(String),
        accountId: expect.any(String),
      })
      expect(userDomainMock.repository.createUser).toHaveBeenCalledTimes(2)
    })
  })
})

describe('#getUserByProfileId', () => {
  beforeEach(() => {
    userDomainMock.repository.getUserByGoogleProfileId.mockClear()
  })

  describe('profileIdキーにgoogleを指定した場合', () => {
    const subject = new UserDomain(contextMock)
    const googleProfileId = faker.string.uuid()
    test('repository.getUserByGoogleProfileIdがコールされること', async () => {
      await subject.getUserByProfileIds({ googleProfileId })

      expect(
        userDomainMock.repository.getUserByGoogleProfileId,
      ).toHaveBeenCalledWith(googleProfileId)
    })
  })

  describe('profileIdキーにgoogleを指定しない場合', () => {
    const subject = new UserDomain(contextMock)
    const otherProfileId = faker.string.uuid()
    test('repository.getUserByGoogleProfileIdはコールされないこと', async () => {
      await subject.getUserByProfileIds({
        otherProfileId,
      } as unknown as Parameters<UserDomain['getUserByProfileIds']>[0])

      expect(
        userDomainMock.repository.getUserByGoogleProfileId,
      ).not.toHaveBeenCalled()
    })
  })
})
