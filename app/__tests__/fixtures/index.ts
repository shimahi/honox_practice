/**
 * @description
 * DBに格納するダミーデータを作成するためのジェネレータを定義する
 * テストおよびシーディングで利用する
 * https://github.com/thoughtbot/fishery
 */

import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import { Factory } from 'fishery'

import type { User } from '@/schemas/type'

export const userFixture = Factory.define<User>(() => {
  return {
    id: createId(),
    accountId: faker.word.noun({ length: { min: 5, max: 12 } }),
    name: faker.person.firstName(),
  }
})
