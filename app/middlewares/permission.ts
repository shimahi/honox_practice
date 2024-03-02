{
}
// import { PostDomain } from '@/domains/post'
// import type { Context } from '@/global'
// import type { Next } from 'hono'
// import { HTTPException } from 'hono/http-exception'
// import { authorize } from './auth'

// export const permissionMiddlewares = {
//   /**
//    * ポストの編集・削除が可能なユーザーかどうかを判定する
//    */
//   async post(c: Context, next: Next) {
//     const body = await c.req.formData()
//     const postDomain = new PostDomain(c)
//     const user = await authorize(c)

//     if (!user) {
//       throw new HTTPException(401, { message: 'Unauthorized' })
//     }

//     // TODO: ここ調べる
//     const postId = body.get('postId')
//     if (!postId) {
//       throw new HTTPException(400, { message: 'Bad Request' })
//     }

//     const post = await postDomain.getPost(postId)

//     if (!post || post.userId !== user.id) {
//       throw new HTTPException(403, { message: 'Forbidden' })
//     }

//     return next()
//   },
// }
