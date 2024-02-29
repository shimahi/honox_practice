import { RepositoryBase } from '@/repositories/_repositoryBase'
import { users } from '@/schemas'
import type { InferInsertModel } from 'drizzle-orm'

export class UserRepository extends RepositoryBase {
  /**
   * ユーザーを作成する
   * @param {InferInsertModel<typeof users>} input
   */
  createUser(input: InferInsertModel<typeof users>) {
    return this.drizzle.insert(users).values(input).returning().get()
  }

  /**
   * すべてのユーザーを取得する
   */
  getUsers() {
    return this.drizzle.query.users.findMany()
  }

  /**
   * ユーザーIDからユーザーを取得する
   * @param {string} userId
   */
  getUser(userId: string) {
    return this.drizzle.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      // with: {
      //   posts: {
      //     orderBy: (posts, { desc }) => desc(posts.createdAt),
      //     limit: 20,
      //   },
      // },
    })
  }

  /**
   * googleProfileIdからユーザーを取得する
   * @param {string} googleProfileId
   */
  async getUserByGoogleProfileId(googleProfileId: string) {
    return this.drizzle.query.users.findFirst({
      where: (users, { eq }) => eq(users.googleProfileId, googleProfileId),
    })
  }
}
