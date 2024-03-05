import { postValidator } from './post'

import { describe, expect, test } from 'bun:test'

describe('#update', () => {
  describe('正常系', () => {
    const input = {
      content: 'test',
    }
    test('バリデーションに成功すること', () => {
      expect(postValidator.update.parse(input)).toEqual(input)
    })
  })
  describe('ポストの中身が空である場合', () => {
    const input = {
      content: '',
    }
    const input2 = {
      content: null,
    }
    const input3 = {}
    test('バリデーションに失敗すること', () => {
      expect(() => postValidator.create.parse(input)).toThrow()
      expect(() => postValidator.create.parse(input2)).toThrow()
      expect(() => postValidator.create.parse(input3)).toThrow()
    })
  })
  describe('ポストの中身が144文字を超える場合', () => {
    const input = {
      content: 'a'.repeat(145),
    }
    test('バリデーションに失敗すること', () => {
      expect(() => postValidator.create.parse(input)).toThrow()
    })
  })
})
