import { jest } from 'bun:test'
import type { Context } from '@/global'

/**
 * @description
 * テストで用いるモックデータのうち、共通で用いるものを定義
 * 各種クラスオブジェクトのモックと、コンストラクタ引数のContextを定義する
 */

//Domainクラスおよびそのメンバのコンストラクタ引数に渡すコンテキスト
export const contextMock: Context = {
  env: {
    DB: jest.fn()(),
    NAME: jest.fn()(),
  },
} as Context

// UserDomainクラスのインスタンスのモック
export const userDomainMock = {
  repository: {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserByGoogleProfileId: jest.fn(),
  },
}
