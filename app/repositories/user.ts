import { RepositoryBase } from '@/repositories/_repositoryBase'
import { users } from '@/schemas'
import { type InferInsertModel, eq } from 'drizzle-orm'
export class UserRepository extends RepositoryBase {
  /**
   * すべてのユーザーを取得する
   */
  private createUser(input: InferInsertModel<typeof users>) {
    return this.drizzle.insert(users).values(input).returning().get()
  }
  /**
   * すべてのユーザーを取得する
   */
  async getUsers() {
    return await this.drizzle.select().from(users).all()
  }

  /**
   * GoogleプロファイルIDからユーザーを取得する
   */
  async getUserByGoogleProfileId(googleProfileId: string) {
    return (
      await this.drizzle
        .select()
        .from(users)
        .where(eq(users.googleProfileId, googleProfileId))
    )?.[0]
  }

  // // profileの情報からユーザーを新規作成する。すでに存在する場合はそのユーザーを返す。
  // async findOrCreateUser(profile: {
  //   provider: string
  //   id: string
  //   displayName: string
  //   photos: { value: string }[]
  // }) {
  //   const existing = await this.getUserByProfileId(profile.id)
  //   if (existing) return existing

  //   const user = await this.createUser({
  //     id: createId(),
  //     profileId: profile.id,
  //     accountId: generateString(),
  //     displayName: profile.displayName,
  //     avatarUri: profile.photos?.[0].value,
  //     provider: profile.provider,
  //     createdAt: new Date(),
  //   })

  //   return {
  //     provider: user.provider,
  //     profileId: user.profileId,
  //   }
  // }
}
