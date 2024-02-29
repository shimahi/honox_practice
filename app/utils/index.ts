/**
 * 指定した文字列を最初の改行、または最大文字数でカットする
 * @param content 対象文字列
 * @param maxLength 最大文字数
 * @param ellipsis 省略記号「...」を末尾に付与するか
 * @param showNextLine 最初の改行以降の文章も表示するか
 */
export const truncate = (
  content: string,
  maxLength = 30,
  ellipsis = true,
  showNextLine = false,
) => {
  // 改行コードで切る
  const newContent = showNextLine ? content : content.split(/\n|\r\n|\r/)[0]
  // 指定文字数まで切る
  const maxStrings = newContent.substring(
    0,
    showNextLine
      ? maxLength + (content.match(/\n|\r\n|\r/g) || []).length
      : maxLength,
  )

  // 省略記号指定があり、truncateされていた場合に「...」を付与
  return ellipsis &&
    ((!showNextLine && content.match(/\n|\r\n|\r/)) ||
      [...content].length > maxLength)
    ? `${maxStrings}…`
    : maxStrings
}

/**
 * オブジェクト配列をcreatedAtの新しい順に並び替える
 * ページネーションのテストなどに用いる
 */
interface ObjectWithCreatedAt {
  createdAt: Date
  // biome-ignore lint/suspicious/noExplicitAny:
  [key: string]: any // 他のプロパティも含むためのオプション
}

export function sortByCreatedAt(
  objects: ObjectWithCreatedAt[],
): ObjectWithCreatedAt[] {
  // 新しい順にソートする比較関数
  const compareFunction = (a: ObjectWithCreatedAt, b: ObjectWithCreatedAt) => {
    return b.createdAt.getTime() - a.createdAt.getTime()
  }

  // ソートして新しい配列を返す
  return objects.slice().sort(compareFunction)
}
