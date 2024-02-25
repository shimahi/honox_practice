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

  test('repository.getUserByGoogleProfileIdがコールされること', async () => {
    const subject = new UserDomain(contextMock)
    const googleProfileId = faker.string.uuid()
    await subject.getUserByProfileId({ googleProfileId })

    expect(
      userDomainMock.repository.getUserByGoogleProfileId,
    ).toHaveBeenCalledWith(googleProfileId)
  })

  test('repository.getUserByGoogleProfileIdはコールされないこと', async () => {
    const subject = new UserDomain(contextMock)
    await subject.getUserByProfileId({})

    expect(
      userDomainMock.repository.getUserByGoogleProfileId,
    ).not.toHaveBeenCalled()
  })
})
