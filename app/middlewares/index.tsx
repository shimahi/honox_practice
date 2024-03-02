import type { FC } from 'hono/jsx'

/**
 * @description
 * テンプレートコンポーネントとpropsを受け取り、JSXElementを返す。
 * routerのrender内で、テンプレートとデータの依存注入に用いる。
 * @param {FC} Template 描画するコンポーネント
 * @param {Parameters<FC>[0]} props コンポーネントに渡すprops
 */
// biome-ignore lint/suspicious/noExplicitAny:
export const createElement = <T extends FC<any>>(
  Template: T,
  props: Parameters<T>[0],
) => <Template {...props} />
