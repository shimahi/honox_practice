import type { Context } from '@app/global'
import { UserRepository } from '@server/repositories/user'

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
}
