import { describe, expect, it } from 'vitest'
import {
  aggregationFn_extent,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_min,
  aggregationFn_sum,
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
