import { RepositoryBase } from '@/repositories/_repositoryBase'
import { type Post, posts } from '@/schemas'
import { type InferInsertModel, eq } from 'drizzle-orm'

export class PostRepository extends RepositoryBase {
  /**
   * ポストを作成する
   */
  createPost(input: InferInsertModel<typeof posts>) {
    return this.drizzle.insert(posts).values(input).returning().get()
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
    return this.drizzle.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      limit,
      offset,
      with: {
        user: true,
      },
    })
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
    return this.drizzle.query.posts
      .findMany({
        where: (posts, { eq }) => eq(posts.userId, userId),
        orderBy: (posts, { desc }) => desc(posts.createdAt),
        limit,
        offset,
      })
      .execute()
  }

  /**
   * IDに一致するポストを取得する
   */
  async getPost(id: Post['id']) {
    const result = await this.drizzle.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        user: true,
      },
    })

    return result
  }

  async updatePost(
    id: Post['id'],
    input: Partial<InferInsertModel<typeof posts>>,
  ) {
    return await this.drizzle
      .update(posts)
      .set(input)
      .where(eq(posts.id, id))
      .returning()
      .get()
  }

  /**
   * ポストを削除する
   * @param {string} id
   */
  deletePost(id: Post['id']) {
    return this.drizzle.delete(posts).where(eq(posts.id, id))
  }
}
