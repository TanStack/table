import { text } from '../filterTypes'

describe('text filter correctly handles undefined row values', () => {
  const rows = [
    { values: { test1: 'aaa', test2: 'bbb' } },
    { values: { test1: 'aaa', test2: 'uuu' } },
    { values: { test1: undefined, test2: 'bbb' } },
  ]
  const ids = ['test1', 'test2']

  test('for single character a', () => {
    const result = text(rows, ids, 'a')

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ values: { test1: 'aaa', test2: 'bbb' } })
    expect(result).toContainEqual({ values: { test1: 'aaa', test2: 'uuu' } })
  })

  test('for single character u', () => {
    const result = text(rows, ids, 'u')

    expect(result).toHaveLength(1)
    expect(result).toContainEqual({ values: { test1: 'aaa', test2: 'uuu' } })
  })

  test('for string bbb', () => {
    const result = text(rows, ids, 'bbb')

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ values: { test1: 'aaa', test2: 'bbb' } })
    expect(result).toContainEqual({
      values: { test1: undefined, test2: 'bbb' },
    })
  })
})
