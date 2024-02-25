import { RepositoryBase } from '@/repositories/_repositoryBase'
import { users } from '@/schemas'
import { createId } from '@paralleldrive/cuid2'
import { type InferInsertModel, eq } from 'drizzle-orm'
export class UserRepository extends RepositoryBase {
  /**
   * ユーザーを作成する
   */
  async createUser(input: InferInsertModel<typeof users>) {
    return await this.drizzle
      .insert(users)
      .values(input)
      .returning()
      .get()
      .catch(async (e) => {
        console.log({ e })

        // accountIdが重複している場合はaccountIdにランダムな文字列を付与して再度登録する
        return await this.drizzle
          .insert(users)
          .values({
            ...input,
            accountId: `${input.accountId}${createId().slice(4)}`,
          })
          .returning()
          .get()
      })
  }

  /**
   * すべてのユーザーを取得する
   */
  async getUsers() {
    return await this.drizzle.select().from(users).all()
  }

  /**
   * GoogleプロファイルIDからユーザーを取得する
   * NOTE:
   * DrizzleのバグでBunのテストで get() メソッドが機能しないため、配列の0番目を返している
   * https://github.com/drizzle-team/drizzle-orm/issues/777
   */
  async getUserByGoogleProfileId(googleProfileId: string) {
    return (
      await this.drizzle
        .select()
        .from(users)
        .where(eq(users.googleProfileId, googleProfileId))
    )?.[0]
  }
}
