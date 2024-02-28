/**
 * @description
 * DBのスキーマをTypeScriptで型定義したもの
 * DBフィールドに対する型注釈は基本的にこれを利用する
 */

import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from '.'

export type User = InferSelectModel<typeof schema.users>
export type Post = InferSelectModel<typeof schema.posts>
