import { PostDomain } from '@/domains/post'
import type { Context } from '@/global'
import type { Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const permissionMiddlewares = {
  /**
   * ポストの編集・削除が可能なユーザーかどうかを判定する
   */
  async post(c: Context<'/:postId/*'>, next: Next) {
    const { postId } = c.req.param()
    if (!postId) throw new HTTPException(400, { message: 'Bad Request' })

    const currentUser = c.get('currentUser')
    if (!currentUser) throw new HTTPException(401, { message: 'Unauthorized' })

    const postDomain = new PostDomain(c)
    const post = await postDomain.getPost(postId)
    if (!post || post.userId !== currentUser.id)
      throw new HTTPException(403, { message: 'Forbidden' })

    return next()
  },
}
