import { beforeEach, describe, expect, jest, mock, test } from 'bun:test'
import { contextMock, userDomainMock } from '@/__tests__'
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
