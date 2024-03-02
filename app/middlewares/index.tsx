import type { Context } from '@/global'
import type { ContextRenderer } from 'hono'
import type { FC } from 'hono/jsx'

/**
 * @description
 * テンプレートコンポーネントとpropsを受け取り、ページを描画する。
 * routerのハンドラ内で使用する。
 * @param {Context} c Honoコンテキスト
 * @param {FC} Template 描画するコンポーネント
 * @param {Parameters<T>[0]} props コンポーネントに渡すprops
 * @param {Parameters<ContextRenderer>[1]} meta ページのメタ情報
 */
// biome-ignore lint/suspicious/noExplicitAny:
export const createElement = <T extends FC<any>>(
  c: Context,
  Template: T,
  props: Parameters<T>[0],
  meta: Parameters<ContextRenderer>[1],
) => {
  return c.render(<Template {...props} />, meta)
}
