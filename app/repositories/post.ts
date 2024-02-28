import { RepositoryBase } from '@/repositories/_repositoryBase'
import { type Post, posts } from '@/schemas'
import { type InferInsertModel, desc, eq } from 'drizzle-orm'
export class PostRepository extends RepositoryBase {
  /**
   * ポストを作成する
   * NOTE:
   * DrizzleのバグでBunのテストで get() メソッドが機能しないため、配列の0番目を返している
   * https://github.com/drizzle-team/drizzle-orm/issues/777
   */
  async createPost(input: InferInsertModel<typeof posts>) {
    return (await this.drizzle.insert(posts).values(input).returning())[0]
  }

  /**
   * offsetを視点にlimit(デフォルト10)単位でポストを取得する
   * @param {number} limit 取得する件数
   * @param {number} offset 取得する開始位置
   */
  paginatePosts({
    limit = 10,
    offset = 0,
  }: { limit?: number; offset?: number } = {}) {
    return this.drizzle
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)
      .all()
  }

  /**
   *
   * @param {string} userId ユーザーID
   * @param {number} limit 取得する件数
   * @param {number} offset 取得する開始位置
   */
  paginatePostsByUserId(
    userId: string,
    { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {},
  ) {
    return this.drizzle
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)
      .all()
  }

  /**
   * IDに一致するポストを取得する
   * NOTE:
   * DrizzleのバグでBunのテストで get() メソッドが機能しないため、配列の0番目を返している
   * https://github.com/drizzle-team/drizzle-orm/issues/777
   */
  async getPost(id: Post['id']) {
    return (await this.drizzle.select().from(posts).where(eq(posts.id, id)))[0]
  }

  /**
   * ポストを更新する
   * NOTE:
   * DrizzleのバグでBunのテストで get() メソッドが機能しないため、配列の0番目を返している
   * https://github.com/drizzle-team/drizzle-orm/issues/777
   * @param {string} userId
   * @param {Partial<InferInsertModel<typeof posts>>} input
   */
  async updatePost(
    id: Post['id'],
    input: Partial<InferInsertModel<typeof posts>>,
  ) {
    return (
      await this.drizzle
        .update(posts)
        .set({
          ...input,
          updatedAt: input.updatedAt ?? new Date(),
        })
        .where(eq(posts.id, id))
        .returning()
    )[0]
  }

  /**
   * ポストを削除する
   * @param {string} id
   */
  deletePost(id: Post['id']) {
    return this.drizzle.delete(posts).where(eq(posts.id, id))
  }
}
