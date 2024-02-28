/**
 * @description
 * DBに格納するダミーデータを作成するためのジェネレータを定義する
 * テストおよびシーディングで利用する
 * https://github.com/thoughtbot/fishery
 */

import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import { Factory } from 'fishery'

import type { Post, User } from '@/schemas/type'

export const userFixture = Factory.define<User>(() => {
  return {
    id: createId(),
    accountId: faker.word.noun({ length: { min: 5, max: 12 } }),
    displayName: faker.person.firstName(),
    googleProfileId: faker.string.uuid(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
})

export const postFixture = Factory.define<Post>(() => {
  return {
    id: createId(),
    userId: faker.lorem.word(),
    content: faker.lorem.paragraphs(3),
    // 単体テストの平易化のため、createdAtとupdatedAtは固定値を設定している
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
})
