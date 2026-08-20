import { describe, expect, it } from 'vitest'
import {
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_first,
  aggregationFn_last,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_min,
  aggregationFn_sum,
  aggregationFn_unique,
  aggregationFn_uniqueCount,
  constructAggregationFn,
} from '../../../src'

function context(values: Array<unknown>) {
  const rows = values.map((value, index) => ({
    id: String(index),
    getValue: () => value,
  }))
  return {
    column: { id: 'value' },
    columnId: 'value',
    getValue: (row: any) => row.getValue('value'),
    rows,
    table: {},
  } as any
}

describe('aggregation function definitions', () => {
  it('preserves sum coercion and NaN behavior', () => {
    expect(aggregationFn_sum.aggregate(context([1, '2', 3, null]))).toBe(4)
    expect(aggregationFn_sum.aggregate(context([1, Number.NaN]))).toBeNaN()
    expect(aggregationFn_sum.aggregate(context([]))).toBe(0)
    expect(
      aggregationFn_sum.merge!({
        ...context([]),
        subRowResults: [4, undefined, 6],
        subRows: [],
      }),
    ).toBe(10)
  })

  it('calculates numeric and Date ranges while preserving types', () => {
    const early = new Date('2024-01-01')
    const late = new Date('2024-03-01')

    expect(aggregationFn_min.aggregate(context([3, -1, 2]))).toBe(-1)
    expect(aggregationFn_max.aggregate(context([3, -1, 2]))).toBe(3)
    expect(aggregationFn_extent.aggregate(context([3, -1, 2]))).toEqual([-1, 3])
    expect(
      aggregationFn_extent.aggregate(context([late, null, early])),
    ).toEqual([early, late])
    expect(aggregationFn_extent.aggregate(context([]))).toEqual([
      undefined,
      undefined,
    ])
  })

  it('uses the first valid range type and ignores incompatible values', () => {
    const date = new Date('2024-01-01')
    expect(aggregationFn_extent.aggregate(context([2, date, 4]))).toEqual([
      2, 4,
    ])
    expect(aggregationFn_extent.aggregate(context([date, 2]))).toEqual([
      date,
      date,
    ])
  })

  it('preserves mean coercion and median numeric-only behavior', () => {
    expect(
      aggregationFn_mean.aggregate(context([null, undefined, '', '2', 4, 'x'])),
    ).toBe(2)
    // Non-numeric values are skipped, not treated as a reason to bail out,
    // so the median is computed from the remaining numeric values (1, 2, 3).
    expect(aggregationFn_median.aggregate(context([3, '2', 1, 2]))).toBe(2)
    expect(aggregationFn_median.aggregate(context([3, 1, 2]))).toBe(2)
    expect(aggregationFn_mean.aggregate(context([]))).toBeUndefined()
    expect(aggregationFn_median.aggregate(context([]))).toBeUndefined()
    expect(aggregationFn_mean.merge).toBeUndefined()
    expect(aggregationFn_median.merge).toBeUndefined()
  })

  it('skips null/non-numeric values in median, like sum/min/max/mean', () => {
    // A null in the group should not discard the whole aggregation.
    expect(aggregationFn_median.aggregate(context([1, null, 2, 3]))).toBe(2)
    expect(
      aggregationFn_median.aggregate(context([null, undefined, 4, '5', 6])),
    ).toBe(5)
    // Even-length numeric result still averages the two middle values.
    expect(aggregationFn_median.aggregate(context([1, null, 2, 3, 4]))).toBe(
      2.5,
    )
    // Only when there are no numeric values left does it fall back to undefined.
    expect(
      aggregationFn_median.aggregate(context([null, undefined, 'x', 'y'])),
    ).toBeUndefined()
  })

  it('uses Set semantics for unique values', () => {
    expect(
      aggregationFn_unique.aggregate(context(['a', null, undefined, 'a'])),
    ).toEqual(['a', null, undefined])
    expect(
      aggregationFn_uniqueCount.aggregate(context(['a', null, undefined, 'a'])),
    ).toBe(3)
    expect(aggregationFn_unique.aggregate(context([]))).toEqual([])
    expect(aggregationFn_uniqueCount.aggregate(context([]))).toBe(0)
  })

  it('counts rows and preserves positional nullish values', () => {
    expect(aggregationFn_count.aggregate(context([null, 2, undefined]))).toBe(3)
    expect(aggregationFn_count.aggregate(context([]))).toBe(0)
    expect(aggregationFn_first.aggregate(context([null, 'a', 'b']))).toBeNull()
    expect(
      aggregationFn_last.aggregate(context(['a', 'b', undefined])),
    ).toBeUndefined()
  })

  it('preserves custom definition result inference', () => {
    const joined = constructAggregationFn<any, any, unknown, string>({
      aggregate: ({ rows }) => rows.map((row) => row.id).join(','),
    })
    expect(joined.aggregate(context([1, 2]))).toBe('0,1')
  })
})
