import { constructAggregationFn } from './aggregationFeature.types'
import type { AggregationContext } from './aggregationFeature.types'

type RangeValue = Date | number

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

function getRangeKind(value: unknown): 'date' | 'number' | undefined {
  if (isNumber(value)) return 'number'
  if (isValidDate(value)) return 'date'
  return undefined
}

function compareRangeValues(left: RangeValue, right: RangeValue) {
  const leftValue = left instanceof Date ? left.getTime() : left
  const rightValue = right instanceof Date ? right.getTime() : right
  return leftValue - rightValue
}

function collectRangeValues(context: AggregationContext<any, any, unknown>) {
  const values: Array<RangeValue> = []
  let kind: 'date' | 'number' | undefined

  for (let i = 0; i < context.rows.length; i++) {
    const value = context.getValue(context.rows[i]!)
    const valueKind = getRangeKind(value)
    if (!valueKind) continue
    kind ??= valueKind
    if (valueKind === kind) values.push(value as RangeValue)
  }

  return values
}

/**
 * Sums numeric row values. Non-number values contribute zero. As in the
 * previous API, `NaN` is a number and therefore propagates through the sum.
 */
export const aggregationFn_sum = constructAggregationFn<
  any,
  any,
  unknown,
  number
>({
  aggregate: (context) => {
    let sum = 0
    for (let i = 0; i < context.rows.length; i++) {
      const value = context.getValue(context.rows[i]!)
      sum += typeof value === 'number' ? value : 0
    }
    return sum
  },
  merge: ({ childResults }) => {
    let sum = 0
    for (let i = 0; i < childResults.length; i++) {
      const value = childResults[i]
      if (isNumber(value)) sum += value
    }
    return sum
  },
})

/**
 * Finds the minimum numeric or Date value. Invalid value types are ignored;
 * `NaN` preserves the legacy numeric seeding behavior.
 */
export const aggregationFn_min = constructAggregationFn<
  any,
  any,
  unknown,
  RangeValue | undefined
>({
  aggregate: (context) => {
    const values = collectRangeValues(context)
    let result = values[0]
    for (let i = 1; i < values.length; i++) {
      if (compareRangeValues(values[i]!, result!) < 0) result = values[i]
    }
    return result
  },
  merge: ({ childResults }) => {
    let result: RangeValue | undefined
    let kind: 'date' | 'number' | undefined
    for (let i = 0; i < childResults.length; i++) {
      const value = childResults[i]
      const valueKind = getRangeKind(value)
      if (!valueKind) continue
      kind ??= valueKind
      if (kind !== valueKind) continue
      if (result === undefined || compareRangeValues(value!, result) < 0) {
        result = value
      }
    }
    return result
  },
})

/**
 * Finds the maximum numeric or Date value. Invalid value types are ignored;
 * `NaN` preserves the legacy numeric seeding behavior.
 */
export const aggregationFn_max = constructAggregationFn<
  any,
  any,
  unknown,
  RangeValue | undefined
>({
  aggregate: (context) => {
    const values = collectRangeValues(context)
    let result = values[0]
    for (let i = 1; i < values.length; i++) {
      if (compareRangeValues(values[i]!, result!) > 0) result = values[i]
    }
    return result
  },
  merge: ({ childResults }) => {
    let result: RangeValue | undefined
    let kind: 'date' | 'number' | undefined
    for (let i = 0; i < childResults.length; i++) {
      const value = childResults[i]
      const valueKind = getRangeKind(value)
      if (!valueKind) continue
      kind ??= valueKind
      if (kind !== valueKind) continue
      if (result === undefined || compareRangeValues(value!, result) > 0) {
        result = value
      }
    }
    return result
  },
})

/**
 * Finds the minimum and maximum numeric or Date values. Empty inputs return
 * `[undefined, undefined]`, preserving the previous built-in result shape.
 */
export const aggregationFn_extent = constructAggregationFn<
  any,
  any,
  unknown,
  [RangeValue | undefined, RangeValue | undefined]
>({
  aggregate: (context) => {
    const values = collectRangeValues(context)
    if (!values.length) return [undefined, undefined]
    let min = values[0]!
    let max = values[0]!
    for (let i = 1; i < values.length; i++) {
      const value = values[i]!
      if (compareRangeValues(value, min) < 0) min = value
      if (compareRangeValues(value, max) > 0) max = value
    }
    return [min, max]
  },
  merge: ({ childResults }) => {
    let result: [RangeValue | undefined, RangeValue | undefined] = [
      undefined,
      undefined,
    ]
    let kind: 'date' | 'number' | undefined
    for (let i = 0; i < childResults.length; i++) {
      const extent = childResults[i]!
      const valueKind = getRangeKind(extent[0])
      if (!valueKind) continue
      kind ??= valueKind
      if (kind !== valueKind) continue
      if (result[0] === undefined) {
        result = [extent[0], extent[1]]
      } else {
        if (compareRangeValues(extent[0]!, result[0]) < 0) {
          result[0] = extent[0]
        }
        if (compareRangeValues(extent[1]!, result[1]!) > 0) {
          result[1] = extent[1]
        }
      }
    }
    return result
  },
})

/**
 * Averages number and number-like row values. Nullish and non-numeric values
 * are ignored; other values retain the legacy unary-plus coercion behavior.
 */
export const aggregationFn_mean = constructAggregationFn<
  any,
  any,
  unknown,
  number | undefined
>({
  aggregate: (context) => {
    let count = 0
    let sum = 0
    for (let i = 0; i < context.rows.length; i++) {
      const value = context.getValue(context.rows[i]!)
      if (value == null) continue
      const numberValue = typeof value === 'number' ? value : +value
      if (!Number.isNaN(numberValue)) {
        count++
        sum += numberValue
      }
    }
    return count ? sum / count : undefined
  },
})

/**
 * Computes the median when every row value is a number. Returns `undefined`
 * for empty inputs or when any value is non-numeric.
 */
export const aggregationFn_median = constructAggregationFn<
  any,
  any,
  unknown,
  number | undefined
>({
  aggregate: (context) => {
    if (!context.rows.length) return undefined
    const values = new Array<number>(context.rows.length)
    for (let i = 0; i < context.rows.length; i++) {
      const value = context.getValue(context.rows[i]!)
      if (typeof value !== 'number') return undefined
      values[i] = value
    }
    values.sort((a, b) => a - b)
    const mid = Math.floor(values.length / 2)
    return values.length % 2
      ? values[mid]
      : (values[mid - 1]! + values[mid]!) / 2
  },
})

/** Collects distinct row values using JavaScript `Set` semantics. */
export const aggregationFn_unique = constructAggregationFn<
  any,
  any,
  unknown,
  Array<unknown>
>({
  aggregate: (context) => {
    const values = new Set<unknown>()
    for (let i = 0; i < context.rows.length; i++) {
      values.add(context.getValue(context.rows[i]!))
    }
    return Array.from(values)
  },
})

/** Counts distinct row values using JavaScript `Set` semantics. */
export const aggregationFn_uniqueCount = constructAggregationFn<
  any,
  any,
  unknown,
  number
>({
  aggregate: (context) => {
    const values = new Set<unknown>()
    for (let i = 0; i < context.rows.length; i++) {
      values.add(context.getValue(context.rows[i]!))
    }
    return values.size
  },
})

/** Counts rows, independently of the column's values. */
export const aggregationFn_count = constructAggregationFn<
  any,
  any,
  unknown,
  number
>({
  aggregate: ({ rows }) => rows.length,
  merge: ({ childResults }) => {
    let count = 0
    for (let i = 0; i < childResults.length; i++) {
      const value = childResults[i]
      if (isNumber(value)) count += value
    }
    return count
  },
})

/** Returns the first row's value, including a nullish value. */
export const aggregationFn_first = constructAggregationFn<
  any,
  any,
  unknown,
  unknown
>({
  aggregate: (context) =>
    context.rows[0] ? context.getValue(context.rows[0]) : undefined,
  merge: ({ childResults }) => childResults[0],
})

/** Returns the last row's value, including a nullish value. */
export const aggregationFn_last = constructAggregationFn<
  any,
  any,
  unknown,
  unknown
>({
  aggregate: (context) => {
    const row = context.rows[context.rows.length - 1]
    return row ? context.getValue(row) : undefined
  },
  merge: ({ childResults }) => childResults[childResults.length - 1],
})

/**
 * Full built-in registry. Register individual definitions for tree-shaking.
 *
 * @deprecated Import individual `aggregationFn_*` definitions instead for a
 * smaller bundle. This registry remains available for compatibility.
 */
export const aggregationFns = {
  sum: aggregationFn_sum,
  min: aggregationFn_min,
  max: aggregationFn_max,
  extent: aggregationFn_extent,
  mean: aggregationFn_mean,
  median: aggregationFn_median,
  unique: aggregationFn_unique,
  uniqueCount: aggregationFn_uniqueCount,
  count: aggregationFn_count,
  first: aggregationFn_first,
  last: aggregationFn_last,
}

export type BuiltInAggregationFn = keyof typeof aggregationFns
