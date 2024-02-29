import { describe, expect, test } from 'bun:test'
import { truncate } from '.'

describe('#truncate', () => {
  describe('指定文字数以下の場合', () => {
    describe('改行がない場合', () => {
      test('すべての文章が取得できること', () => {
        const content = '12345あいうえお'
        const result = truncate(content, 10)
        expect(result).toBe('12345あいうえお')
      })
    })

    describe('指定文字数以前に改行が含まれている場合', () => {
      describe('改行コードが\\nの場合', () => {
        test('改行までの文字が取得できること', () => {
          const content = '12345\nあいうえお'
          const result = truncate(content, 10)
          expect(result).toBe('12345…')
        })
      })

      describe('改行コードが\\rの場合', () => {
        test('改行までの文字が取得できること', () => {
          const content = '12345\rあいうえお'
          const result = truncate(content, 10)
          expect(result).toBe('12345…')
        })
      })

      describe('改行コードが\\r\\nの場合', () => {
        test('改行までの文字が取得できること', () => {
          const content = '12345\r\nあいうえお'
          const result = truncate(content, 10)
          expect(result).toBe('12345…')
        })
      })
      describe('改行後の文章の表示を指定した場合', () => {
        test('改行後も含めて文字を取得できること', () => {
          const content = '12345\nあいうえお'
          const result = truncate(content, 10, false, true)
          expect(result).toBe('12345\nあいうえお')
        })
      })
    })
  })
  describe('指定文字数より長い場合', () => {
    describe('改行がない場合', () => {
      test('指定文字数までが取得できること', () => {
        const content = '12345あいうえお1'
        const result = truncate(content, 10)
        expect(result).toBe('12345あいうえお…')
      })
    })

    describe('指定文字数以降に改行がある場合', () => {
      describe('改行コードが\\nの場合', () => {
        test('指定文字までが取得できること', () => {
          const content = '12345あいうえお\n'
          const result = truncate(content, 10)
          expect(result).toBe('12345あいうえお…')
        })
      })

      describe('改行コードが\\rの場合', () => {
        test('指定文字までが取得できること', () => {
          const content = '12345あいうえお\r'
          const result = truncate(content, 10)
          expect(result).toBe('12345あいうえお…')
        })
      })

      describe('改行コードが\\r\\nの場合', () => {
        test('指定文字までが取得できること', () => {
          const content = '12345あいうえお\r\n'
          const result = truncate(content, 10)
          expect(result).toBe('12345あいうえお…')
        })
      })
    })

    describe('指定文字数以前に改行がある場合', () => {
      describe('改行コードが\\nの場合', () => {
        test('改行までの文字が取得できること', () => {
          const content = '12345\nあいうえお'
          const result = truncate(content, 10)
          expect(result).toBe('12345…')
        })
      })

      describe('改行コードが\\rの場合', () => {
        test('改行までの文字が取得できること', () => {
          const content = '12345\rあいうえお'
          const result = truncate(content, 10)
          expect(result).toBe('12345…')
        })
      })

      describe('改行コードが\\r\\nの場合', () => {
        test('改行までの文字が取得できること', () => {
          const content = '12345\r\nあいうえお'
          const result = truncate(content, 10)
          expect(result).toBe('12345…')
        })
      })
    })
    describe('改行後の文章の表示を指定した場合', () => {
      test('改行後も含めて指定文字まで取得できること', () => {
        const content = '12345\nあいうえお'
        const result = truncate(content, 8, false, true)
        expect(result).toBe('12345\nあいう')
      })
    })
  })

  describe('省略記号', () => {
    describe('ellipsis指定の場合', () => {
      describe('もとの文章がmaxLength以下だった場合', () => {
        test('そのままの文字列が返されること', () => {
          const content = '12345あいうえお'
          const result = truncate(content, 10, true)
          expect(result).toBe('12345あいうえお')
        })
      })

      describe('もとの文章がmaxLengthより多かった場合', () => {
        test('省略記号が付与されて返されること', () => {
          const content = '12345あいうえお0'
          const result = truncate(content, 10, true)
          expect(result).toBe('12345あいうえお…')
        })
      })

      describe('もとの文章に改行が含まれていた場合', () => {
        test('省略記号が付与されて返されること', () => {
          const content = '12345\nあいうえお'
          const result = truncate(content, 10, true)
          expect(result).toBe('12345…')
        })
      })
      describe('改行後の文章の表示を指定した場合', () => {
        test('改行を含む指定文字数までの文章に省略記号が付与されて返されること', () => {
          const content = '12345\nあいうえお'
          const result = truncate(content, 8, true, true)
          expect(result).toBe('12345\nあいう…')
        })
      })
    })

    describe('ellipsis指定がない場合', () => {
      describe('もとの文章がmaxLength以下だった場合', () => {
        test('そのままの文字列が返されること', () => {
          const content = '12345あいうえお'
          const result = truncate(content, 10, true)
          expect(result).toBe('12345あいうえお')
        })
      })

      describe('もとの文章がmaxLengthより多かった場合', () => {
        test('省略記号が付与されずに返されること', () => {
          const content = '12345あいうえお0'
          const result = truncate(content, 10, true)
          expect(result).toBe('12345あいうえお…')
        })
      })
    })
  })
})
