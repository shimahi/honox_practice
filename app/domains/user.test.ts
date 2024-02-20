import { afterAll, describe, expect, jest, mock, test } from 'bun:test'
import { ContextMock, userDomainMock } from '@app/__tests__'
import { UserDomain } from './user'

/**
 * =============================
 * テスト環境のセットアップ
 * =============================
 */
// UserDomainの依存モジュールをモックする
mock.module('@app/repositories/user', () => ({
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
    await subject.getUsers()

    expect(userDomainMock.repository.getUsers).toHaveBeenCalled()
  })
})
