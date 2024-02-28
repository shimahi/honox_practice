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
  getUsers() {
    return this.repository.getUsers()
  }

  /**
   * 認証プロバイダーのプロファイルIDからユーザーを作成する
   * 既に存在する場合は作成をスキップして、そのユーザーを返す
   * @param {ProfileIds} profileIds 検索したいプロファイルIDのカラム名
   * @param {string} profileId プロファイルID
   * @prams inputs その他のユーザー情報
   */
  async createUser(
    profileIds: ProfileIds,
    inputs: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'googleProfileId'>,
  ) {
    const { key, profileId } = parseProfileId(profileIds)
    const user = await this.getUserByProfileIds(profileIds)
    // 既にユーザーがいればreturn
    if (user) return user

    const params = {
      // CUIDを生成し、ユーザーIDとする。
      id: createId(),
      ...inputs,
      ...(() => {
        switch (key) {
          case 'googleProfileId':
            return { googleProfileId: profileId }
        }
      })(),
    }

    return this.repository.createUser(params).catch(() =>
      // accountIdが重複している場合はaccountIdにランダムな文字列を付与して再度登録する
      this.repository.createUser({
        ...params,
        accountId: `${params.accountId}${createId().slice(4)}`,
      }),
    )
  }

  /**
   * 認証プロバイダーのプロファイルIDからユーザーを取得する
   * @param {ProfileIds} profileIds 検索したいプロファイルIDの {カラム名: プロファイルID}のオブジェクト
   * @param {string} profileId プロファイルID
   */
  getUserByProfileIds(profileIds: ProfileIds) {
    const { key, profileId } = parseProfileId(profileIds)

    switch (key) {
      case 'googleProfileId':
        return this.repository.getUserByGoogleProfileId(profileId)
    }
  }
}

type ProfileIds = Pick<User, 'googleProfileId'>
/**
 * プロファイルIDのオブジェクトに対して、有効なカラム名とプロファイルIDを返す
 * @param profileIds
 * @returns
 */
function parseProfileId(profileIds: ProfileIds) {
  const key = String(Object.keys(profileIds).find(Boolean)) as keyof ProfileIds
  const profileId = String(profileIds[key as keyof ProfileIds])

  return { key, profileId }
}
