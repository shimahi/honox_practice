import type { Context } from '@/global'
import { UserRepository } from '@/repositories/user'
import type { User } from '@/schemas'
import { createId } from '@paralleldrive/cuid2'

export class UserDomain {
  private readonly repository

  constructor(c: Context) {
    this.repository = new UserRepository(c.env.DB)
  }

  /**
   * ユーザーをすべて取得する
   */
  async getUsers() {
    return await this.repository.getUsers()
  }

  /**
   * 認証プロバイダーのプロファイルIDからユーザーを作成する
   */
  async createUser({
    googleProfileId,
    ...inputs
  }: Pick<User, 'accountId' | 'displayName'> & {
    googleProfileId?: string
  }) {
    const params = {
      ...inputs,
      id: createId(),
    }

    if (googleProfileId) {
      const user = await this.getUserByProfileId({
        googleProfileId,
      })
      return (
        user ??
        (await this.repository.createUser({
          ...params,
          googleProfileId,
        }))
      )
    }
  }

  /**
   * 認証プロバイダーのプロファイルIDからユーザーを取得する
   */
  async getUserByProfileId({ googleProfileId }: { googleProfileId?: string }) {
    if (googleProfileId) {
      return await this.repository.getUserByGoogleProfileId(googleProfileId)
    }
  }
}
