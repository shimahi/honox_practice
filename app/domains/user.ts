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

  /**
   * Googleアカウントでログインする。新規の場合はユーザーを作成する。
   * @param {AuthenticateOptions} option 認証成功・失敗時のリダイレクト先をsuccessRedirect・failureRedirectで指定する。
   */
  async loginWithGoogle(args: unknown) {
    // return this.authService.authenticateWithGoogle(async ({ profile }) => {
    //   if (!profile || !profile.id)
    //     throw new Error('認証情報の取得に失敗しました。')
    //   // アカウント情報からユーザーを取得/作成する
    //   return this.repository.findOrCreateUser(profile)
  }
}
