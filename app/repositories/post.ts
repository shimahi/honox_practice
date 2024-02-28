import { RepositoryBase } from '@/repositories/_repositoryBase'
import { type Post, posts } from '@/schemas'
import { type InferInsertModel, eq } from 'drizzle-orm'
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
}
