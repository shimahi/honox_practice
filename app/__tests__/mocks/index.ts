import { jest } from 'bun:test'
import type { Context } from '@app/global'

/**
 * @description
 * テストで用いるモックデータのうち、共通で用いるものを定義
 * 各種クラスオブジェクトのモックと、コンストラクタ引数のContextを定義する
 */

//Domainクラスおよびそのメンバのコンストラクタ引数に渡すコンテキスト
export const ContextMock: Context = {
  env: {
    DB: undefined as unknown,
    NAME: undefined as unknown,
  },
} as Context

// UserDomainクラスのインスタンスのモック
export const userDomainMock = {
  repository: {
    getUsers: jest.fn(),
  },
}
