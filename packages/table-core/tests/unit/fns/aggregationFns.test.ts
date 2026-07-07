import { describe, expect, it } from 'vitest'
import {
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_min,
  aggregationFn_sum,
  aggregationFn_unique,
  aggregationFn_uniqueCount,
} from '../../../src'

function makeRows(values: Array<unknown>) {
  return values.map((value) => ({
    getValue: () => value,
  }))
}

describe('Aggregation Functions', () => {
  it('sums numeric child row values and treats non-numbers as zero', () => {
    expect(
      aggregationFn_sum('value', [], makeRows([1, '2', 3, null]) as any),
    ).toBe(4)
  })

  it('preserves NaN seeding behavior for min, max, and extent', () => {
    const rows = makeRows([Number.NaN, 1, 2]) as any

    expect(Number.isNaN(aggregationFn_min('value', [], rows))).toBe(true)
    expect(Number.isNaN(aggregationFn_max('value', [], rows))).toBe(true)

    const extent = aggregationFn_extent('value', [], rows)
    expect(Number.isNaN(extent[0])).toBe(true)
    expect(Number.isNaN(extent[1])).toBe(true)
  })

  it('ignores non-number values for min, max, and extent', () => {
    const rows = makeRows([null, undefined, '1', 3, -1]) as any

    expect(aggregationFn_min('value', [], rows)).toBe(-1)
    expect(aggregationFn_max('value', [], rows)).toBe(3)
    expect(aggregationFn_extent('value', [], rows)).toEqual([-1, 3])
  })

  it('keeps mean nullish handling distinct from numeric coercion', () => {
    const rows = makeRows([null, undefined, '', '2', 4, 'x']) as any

    expect(aggregationFn_mean('value', rows)).toBe(2)
  })
})

describe('median', () => {
  it('returns undefined for empty groups', () => {
    expect(aggregationFn_median('value', makeRows([]) as any)).toBeUndefined()
  })

  it('returns the single value for one-row groups', () => {
    expect(aggregationFn_median('value', makeRows([5]) as any)).toBe(5)
  })

  it('returns the middle value for odd-length groups', () => {
    expect(aggregationFn_median('value', makeRows([3, 1, 2]) as any)).toBe(2)
  })

  it('averages the two middle values for even-length groups', () => {
    expect(aggregationFn_median('value', makeRows([4, 1, 3, 2]) as any)).toBe(
      2.5,
    )
  })

  it('returns undefined when any value is not a number', () => {
    expect(
      aggregationFn_median('value', makeRows([1, '2', 3]) as any),
    ).toBeUndefined()
  })
})

describe('unique / uniqueCount', () => {
  it('collects distinct values in first-seen order', () => {
    expect(
      aggregationFn_unique('value', makeRows(['a', 'b', 'a', 'c']) as any),
    ).toEqual(['a', 'b', 'c'])
  })

  it('counts distinct values with Set semantics', () => {
    expect(
      aggregationFn_uniqueCount(
        'value',
        makeRows(['a', 'b', 'a', null, null]) as any,
      ),
    ).toBe(3)
  })
})

describe('count', () => {
  it('counts leaf rows and ignores the column id', () => {
    expect(aggregationFn_count('anything', makeRows([1, 2, 3]) as any)).toBe(3)
    expect(aggregationFn_count('anything', makeRows([]) as any)).toBe(0)
  })
})
