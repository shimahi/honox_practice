import type { Context } from '@/global'
import { UserRepository } from '@/repositories/user'

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
