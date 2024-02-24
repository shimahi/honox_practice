import { RepositoryBase } from '@/repositories/_repositoryBase'
import { users } from '@/schemas'
import { eq } from 'drizzle-orm'
export class UserRepository extends RepositoryBase {
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
}
