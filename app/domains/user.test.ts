import { afterAll, describe, expect, jest, mock, test } from 'bun:test'
import { ContextMock, userDomainMock } from '@/__tests__'
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
afterAll(() => {
  mock.restore()
  jest.restoreAllMocks()
})

/**
 * =============================
 * テストケースの実装
 * =============================
 */
describe('#getUsers', () => {
  const subject = new UserDomain(ContextMock)
  test('repository.getUsersがコールされること', async () => {
    console.log(await subject.getUsers())

    expect(userDomainMock.repository.getUsers).toHaveBeenCalled()
  })
})

describe('#getUserByProfileId', () => {
  test('googleProfileIdキーを渡さないとき、repository.getUserByGoogleProfileIdはコールされないこと', async () => {
    const subject = new UserDomain(ContextMock)
    await subject.getUserByProfileId({})

    expect(
      userDomainMock.repository.getUserByGoogleProfileId,
    ).not.toHaveBeenCalled()
  })
  test('googleProfileIdキーが渡されたとき、repository.getUserByGoogleProfileIdがコールされること', async () => {
    const subject = new UserDomain(ContextMock)
    const googleProfileId = faker.string.uuid()
    await subject.getUserByProfileId({ googleProfileId })

    expect(
      userDomainMock.repository.getUserByGoogleProfileId,
    ).toHaveBeenCalledWith(googleProfileId)
  })
})
