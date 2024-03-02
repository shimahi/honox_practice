import type { Context } from '@/global'
import { PostRepository } from '@/repositories/post'
import type { Post } from '@/schemas'
import { createId } from '@paralleldrive/cuid2'

export class PostDomain {
  private readonly repository

  constructor(c: Context) {
    this.repository = new PostRepository(c.env.DB)
  }

  /**
   * ポストを作成する
   * @param {string} userId
   * @param {Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>} input
   */
  createPost(
    userId: string,
    input: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.repository.createPost({
      id: createId(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    })
  }

  /**
   * ポスト一覧をページネーションで取得する
   * @param {number} limit 取得する件数
   * @param {number} offset 取得する開始位置
   */
  pagenatePosts({
    limit = 10,
    offset = 0,
  }: Parameters<PostRepository['paginatePosts']>[0] = {}) {
    return this.repository.paginatePosts({ limit, offset })
  }

  /**
   * ユーザーIDに一致するポスト一覧をページネーションで取得する
   * @param {string} userId ユーザーID
   * @param {number} limit 取得する件数
   * @param {number} offset 取得する開始位置
   */
  paginatePostsByUserId(
    userId: string,
    {
      limit = 10,
      offset = 0,
    }: Parameters<PostRepository['paginatePostsByUserId']>[1] = {},
  ) {
    return this.repository.paginatePostsByUserId(userId, { limit, offset })
  }

  /**
   * IDに一致するポストを取得する
   * @param {string} id ポストID
   */
  getPost(id: Post['id']) {
    return this.repository.getPost(id)
  }

  /**
   * ポストを削除する
   * @param {string} id ポストID
   */
  deletePost(id: Post['id']) {
    return this.repository.deletePost(id)
  }
}
