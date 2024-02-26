import { RepositoryBase } from '@/repositories/_repositoryBase'
import { users } from '@/schemas'
import { type InferInsertModel, eq } from 'drizzle-orm'
export class UserRepository extends RepositoryBase {
  /**
   * ユーザーを作成する
   * NOTE:
   * DrizzleのバグでBunのテストで get() メソッドが機能しないため、配列の0番目を返している
   * https://github.com/drizzle-team/drizzle-orm/issues/777
   */
  async createUser(input: InferInsertModel<typeof users>) {
    return (await this.drizzle.insert(users).values(input).returning())[0]
  }

  /**
   * すべてのユーザーを取得する
   */
  getUsers() {
    return this.drizzle.select().from(users).all()
  }

  /**
   * googleProfileIdからユーザーを取得する
   * @param {string} googleProfileId
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
