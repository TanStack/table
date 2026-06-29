import { describe, expect, it } from 'vitest'
import {
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
} from '../../../src'

const makeRow = (value: any): any => ({
  getValue: () => value,
})

const cmp = (
  fn: (a: any, b: any, c: string) => number,
  a: any,
  b: any,
): number => {
  const result = fn(makeRow(a), makeRow(b), 'col')
  // Normalize to -1 / 0 / 1 for stable assertions across sign-only comparators
  return result < 0 ? -1 : result > 0 ? 1 : 0
}

describe('sortFn_alphanumeric (compareAlphanumeric)', () => {
  it('returns 0 for equal strings', () => {
    expect(cmp(sortFn_alphanumeric, 'abc', 'abc')).toBe(0)
  })

  it('returns 0 for two empty strings', () => {
    expect(cmp(sortFn_alphanumeric, '', '')).toBe(0)
  })

  it('sorts pure strings lexicographically', () => {
    expect(cmp(sortFn_alphanumeric, 'apple', 'banana')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, 'banana', 'apple')).toBe(1)
  })

  it('sorts pure numbers numerically (natural sort)', () => {
    // The whole point: "item2" should come before "item10"
    expect(cmp(sortFn_alphanumeric, 'item2', 'item10')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, 'item10', 'item2')).toBe(1)
  })

  it('sorts mixed alphanumeric strings naturally', () => {
    expect(cmp(sortFn_alphanumeric, 'a1b2', 'a1b10')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, 'a2b', 'a10b')).toBe(-1)
  })

  it('treats string chunk less than number chunk in mixed-type comparison', () => {
    // When chunk types differ at the same position, string sorts before number
    expect(cmp(sortFn_alphanumeric, 'abc', '123')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, '123', 'abc')).toBe(1)
  })

  it('returns difference in chunk count when one is a prefix of the other', () => {
    // After all common chunks are consumed, the longer one wins (positive)
    expect(cmp(sortFn_alphanumeric, 'abc', 'abc1')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, 'abc1', 'abc')).toBe(1)
  })

  it('returns 0 when both strings normalize to no chunks', () => {
    // Empty strings split+filter to []
    expect(cmp(sortFn_alphanumeric, '', '')).toBe(0)
  })

  it('lowercases input (case-insensitive)', () => {
    expect(cmp(sortFn_alphanumeric, 'ABC', 'abc')).toBe(0)
    expect(cmp(sortFn_alphanumeric, 'Apple', 'banana')).toBe(-1)
  })

  it('coerces numbers to strings via toString', () => {
    expect(cmp(sortFn_alphanumeric, 2, 10)).toBe(-1)
    expect(cmp(sortFn_alphanumeric, 10, 2)).toBe(1)
  })

  it('treats NaN/Infinity numbers as empty', () => {
    expect(cmp(sortFn_alphanumeric, NaN, '')).toBe(0)
    expect(cmp(sortFn_alphanumeric, Infinity, '')).toBe(0)
  })

  it('handles long mixed strings (stress: many chunks)', () => {
    const a = 'abc1def2ghi3jkl4mno5'
    const b = 'abc1def2ghi3jkl4mno10'
    expect(cmp(sortFn_alphanumeric, a, b)).toBe(-1)
    expect(cmp(sortFn_alphanumeric, b, a)).toBe(1)
  })

  it('sort() integration: produces natural order', () => {
    const items = ['item10', 'item2', 'item1', 'item20', 'item3']
    items.sort((a, b) => sortFn_alphanumeric(makeRow(a), makeRow(b), 'col'))
    expect(items).toEqual(['item1', 'item2', 'item3', 'item10', 'item20'])
  })
})

describe('sortFn_alphanumericCaseSensitive', () => {
  it('preserves case (uppercase < lowercase by ASCII)', () => {
    expect(cmp(sortFn_alphanumericCaseSensitive, 'ABC', 'abc')).toBe(-1)
    expect(cmp(sortFn_alphanumericCaseSensitive, 'abc', 'ABC')).toBe(1)
  })

  it('sorts naturally with case sensitivity', () => {
    expect(cmp(sortFn_alphanumericCaseSensitive, 'Item2', 'Item10')).toBe(-1)
  })
})

describe('sortFn_text', () => {
  it('returns 0 for equal strings', () => {
    expect(cmp(sortFn_text, 'abc', 'abc')).toBe(0)
  })

  it('sorts lexicographically (no natural sort)', () => {
    // text uses compareBasic — "item10" < "item2" lexicographically
    expect(cmp(sortFn_text, 'item10', 'item2')).toBe(-1)
  })

  it('lowercases input', () => {
    expect(cmp(sortFn_text, 'ABC', 'abc')).toBe(0)
  })
})

describe('sortFn_textCaseSensitive', () => {
  it('preserves case', () => {
    expect(cmp(sortFn_textCaseSensitive, 'ABC', 'abc')).toBe(-1)
  })
})

describe('sortFn_basic', () => {
  it('returns 0 for equal values', () => {
    expect(cmp(sortFn_basic, 5, 5)).toBe(0)
  })

  it('compares numbers', () => {
    expect(cmp(sortFn_basic, 1, 2)).toBe(-1)
    expect(cmp(sortFn_basic, 2, 1)).toBe(1)
  })

  it('compares strings', () => {
    expect(cmp(sortFn_basic, 'a', 'b')).toBe(-1)
  })
})

describe('compareAlphanumeric boundary chunks (filter-removal regression)', () => {
  // The inline empty-chunk skipping must match the old `.filter(Boolean)`
  // behavior; empty chunks occur where a string starts/ends with digits.

  it('handles leading digit groups', () => {
    // Number chunk vs string chunk at position 0 — string sorts first
    expect(cmp(sortFn_alphanumeric, '1abc', 'abc1')).toBe(1)
    expect(cmp(sortFn_alphanumeric, 'abc1', '1abc')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, '2abc', '10abc')).toBe(-1)
  })

  it('handles pure digit strings (leading and trailing empties)', () => {
    expect(cmp(sortFn_alphanumeric, '12', '12')).toBe(0)
    expect(cmp(sortFn_alphanumeric, '2', '10')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, '10', '2')).toBe(1)
  })

  it('treats leading zeros as numerically equal', () => {
    expect(cmp(sortFn_alphanumeric, 'item007', 'item7')).toBe(0)
  })

  it('counts only non-empty chunks in the prefix tail', () => {
    // a exhausts past its trailing empty; b has one real chunk remaining
    expect(cmp(sortFn_alphanumeric, '1', '1abc')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, '1abc', '1')).toBe(1)
    expect(cmp(sortFn_alphanumeric, 'abc', 'abc123')).toBe(-1)
  })

  it('handles empty vs non-empty strings', () => {
    expect(cmp(sortFn_alphanumeric, '', 'a')).toBe(-1)
    expect(cmp(sortFn_alphanumeric, 'a', '')).toBe(1)
  })

  it('matches the previous filter-based implementation across all vocab pairs', () => {
    // Reference: the implementation before the allocation refactor, verbatim
    const reference = (aStr: string, bStr: string): number => {
      const a = aStr.split(/([0-9]+)/gm).filter(Boolean)
      const b = bStr.split(/([0-9]+)/gm).filter(Boolean)
      let ai = 0
      let bi = 0
      const aLen = a.length
      const bLen = b.length
      while (ai < aLen && bi < bLen) {
        const aa = a[ai++]!
        const bb = b[bi++]!
        const an = parseInt(aa, 10)
        const bn = parseInt(bb, 10)
        const combo = [an, bn].sort()
        if (isNaN(combo[0]!)) {
          if (aa > bb) return 1
          if (bb > aa) return -1
          continue
        }
        if (isNaN(combo[1]!)) {
          return isNaN(an) ? -1 : 1
        }
        if (an > bn) return 1
        if (bn > an) return -1
      }
      return aLen - ai - (bLen - bi)
    }

    const vocab = [
      '',
      'a',
      'ab',
      '1',
      '0',
      '12',
      '007',
      '7',
      '1a',
      'a1',
      '1a1',
      'a1a',
      '1a2b',
      'a1b2',
      '12ab34',
      'ab12cd',
      'item2',
      'item10',
      '2item',
      '10item',
      'a007b',
      'a7b',
      'nan',
      'infinity',
      '999999999999999999999999999999',
    ]

    for (const a of vocab) {
      for (const b of vocab) {
        // Case-sensitive variant is a pure passthrough for string inputs
        const actual = sortFn_alphanumericCaseSensitive(
          makeRow(a),
          makeRow(b),
          'col',
        )
        expect(actual, `compare("${a}", "${b}")`).toBe(reference(a, b))
      }
    }
  })
})

describe('sortFn_datetime', () => {
  it('returns 0 for equal dates', () => {
    const d = new Date(2026, 1, 1)
    expect(cmp(sortFn_datetime, d, d)).toBe(0)
  })

  it('compares dates by chronology', () => {
    const earlier = new Date(2026, 1, 1)
    const later = new Date(2026, 1, 2)
    expect(cmp(sortFn_datetime, earlier, later)).toBe(-1)
    expect(cmp(sortFn_datetime, later, earlier)).toBe(1)
  })

  it('compares numeric timestamps', () => {
    expect(cmp(sortFn_datetime, 1000, 2000)).toBe(-1)
  })
})
