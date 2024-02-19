/**
 * @description
 * DBのスキーマをTypeScriptで型定義したもの
 * DBフィールドに対する型注釈は基本的にこれを利用する
 */

import type { InferSelectModel } from 'drizzle-orm'

import type { users } from '.'

export type User = InferSelectModel<typeof users>
