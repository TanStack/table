import type {
  AggregationFnDef,
  CreatedAggregationFn,
} from '../features/column-grouping/columnGroupingFeature.types'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'

/**
 * Builds an `AggregationFn` from a value-level reducer plus optional
 * `resolveDataValue` and `fromRows` settings.
 *
 * The `aggregate` reducer receives an array of the group rows' values, each
 * already passed through `resolveDataValue` when one is defined. Keeping
 * normalization in the resolver means a variant of an existing aggregation
 * function only has to swap the resolver, not re-implement the computation.
 *
 * The definition is attached to the returned function, so a variant can be
 * created by spreading a built-in aggregation function and overriding what
 * differs. For example, a `min` that works on date columns:
 *
 * ```ts
 * const earliest = constructAggregationFn({
 *   ...aggregationFn_min,
 *   resolveDataValue: (value) =>
 *     value instanceof Date ? value.getTime() : value,
 * })
 * ```
 *
 * The built-in `count`, `first`, and `last` aggregation functions are plain
 * row-level functions instead: they read group position or size and never
 * look at every value, so materializing a values array would be wasted work.
 */
export function constructAggregationFn<
  TFeatures extends TableFeatures = any,
  TData extends RowData = any,
>(
  def: AggregationFnDef<TFeatures, TData>,
): CreatedAggregationFn<TFeatures, TData> {
  const aggregationFn: CreatedAggregationFn<TFeatures, TData> = Object.assign(
    <TRowFeatures extends TableFeatures, TRowData extends RowData>(
      columnId: string,
      leafRows: Array<Row<TRowFeatures, TRowData>>,
      childRows: Array<Row<TRowFeatures, TRowData>>,
    ): any => {
      const rows = aggregationFn.fromRows === 'childRows' ? childRows : leafRows
      const resolveDataValue = aggregationFn.resolveDataValue
      const values: Array<any> = new Array(rows.length)
      for (let i = 0; i < rows.length; i++) {
        const value = rows[i]!.getValue(columnId)
        values[i] = resolveDataValue ? resolveDataValue(value) : value
      }
      // The def's reducer is typed against the factory's TFeatures/TData;
      // the caller's row generics are erased at this boundary.
      return aggregationFn.aggregate(values, rows as any, columnId)
    },
    def,
  )
  return aggregationFn
}

/**
 * Sums numeric child-row values for a grouped column.
 *
 * Non-number values contribute `0`. Child rows are used so nested group totals
 * can reuse already aggregated values.
 */
export const aggregationFn_sum = constructAggregationFn({
  fromRows: 'childRows',
  aggregate: (values) => {
    let sumValue = 0
    for (let i = 0; i < values.length; i++) {
      const nextValue = values[i]
      sumValue += typeof nextValue === 'number' ? nextValue : 0
    }
    return sumValue
  },
})

/**
 * Finds the minimum numeric child-row value for a grouped column.
 *
 * Nullish and non-number values are ignored. Returns `undefined` when no
 * numeric value is found.
 */
export const aggregationFn_min = constructAggregationFn({
  fromRows: 'childRows',
  aggregate: (values) => {
    let minValue: number | undefined

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      if (
        typeof value === 'number' &&
        (minValue === undefined || value < minValue)
      ) {
        minValue = value
      }
    }

    return minValue
  },
})

/**
 * Finds the maximum numeric child-row value for a grouped column.
 *
 * Nullish and non-number values are ignored. Returns `undefined` when no
 * numeric value is found.
 */
export const aggregationFn_max = constructAggregationFn({
  fromRows: 'childRows',
  aggregate: (values) => {
    let maxValue: number | undefined

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      if (
        typeof value === 'number' &&
        (maxValue === undefined || value > maxValue)
      ) {
        maxValue = value
      }
    }

    return maxValue
  },
})

/**
 * Finds the numeric extent for a grouped column.
 *
 * Returns `[min, max]`, where each entry is `undefined` when no numeric value is
 * present.
 */
export const aggregationFn_extent = constructAggregationFn({
  fromRows: 'childRows',
  aggregate: (values) => {
    let minValue: number | undefined
    let maxValue: number | undefined

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      if (typeof value === 'number') {
        if (minValue === undefined) {
          minValue = maxValue = value
        } else {
          if (minValue > value) minValue = value
          if (maxValue! < value) maxValue = value
        }
      }
    }

    return [minValue, maxValue]
  },
})

/**
 * Averages numeric leaf-row values for a grouped column.
 *
 * Number-like values are coerced with unary `+`; nullish and non-numeric values
 * are ignored.
 */
export const aggregationFn_mean = constructAggregationFn({
  aggregate: (values) => {
    let count = 0
    let sumValue = 0

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      if (value != null && typeof value === 'number') {
        ++count
        sumValue += value
      } else if (value != null) {
        const numValue = +value
        if (!Number.isNaN(numValue)) {
          ++count
          sumValue += numValue
        }
      }
    }

    if (count) return sumValue / count

    return
  },
})

/**
 * Computes the median of numeric leaf-row values for a grouped column.
 *
 * All values must be numbers. If any value is non-numeric, or no leaf rows are
 * present, the result is `undefined`.
 */
export const aggregationFn_median = constructAggregationFn({
  aggregate: (values: Array<number>) => {
    if (!values.length) {
      return
    }

    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] !== 'number') return
    }

    if (values.length === 1) {
      return values[0]
    }

    const mid = Math.floor(values.length / 2)
    values.sort((a, b) => a - b)
    return values.length % 2 !== 0
      ? values[mid]
      : (values[mid - 1]! + values[mid]!) / 2
  },
})

/**
 * Collects unique leaf-row values for a grouped column.
 *
 * Values are compared with JavaScript `Set` semantics.
 */
export const aggregationFn_unique = constructAggregationFn({
  aggregate: (values) => Array.from(new Set(values).values()),
})

/**
 * Counts unique leaf-row values for a grouped column.
 *
 * Values are compared with JavaScript `Set` semantics.
 */
export const aggregationFn_uniqueCount = constructAggregationFn({
  aggregate: (values) => new Set(values).size,
})

/**
 * Counts the number of leaf rows in the group.
 *
 * The column id is ignored because the result is based only on group size.
 * This is a plain row-level function (not built with
 * `constructAggregationFn`) because it never reads row values.
 */
export function aggregationFn_count<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(_columnId: string, leafRows: Array<Row<TFeatures, TData>>) {
  return leafRows.length
}

/**
 * Returns the first leaf-row value for a grouped column.
 *
 * This is a plain row-level function (not built with
 * `constructAggregationFn`) because it only reads one positional value.
 */
export function aggregationFn_first<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columnId: string, leafRows: Array<Row<TFeatures, TData>>) {
  return leafRows[0]?.getValue(columnId)
}

/**
 * Returns the last leaf-row value for a grouped column.
 *
 * This is a plain row-level function (not built with
 * `constructAggregationFn`) because it only reads one positional value.
 */
export function aggregationFn_last<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columnId: string, leafRows: Array<Row<TFeatures, TData>>) {
  return leafRows[leafRows.length - 1]?.getValue(columnId)
}

/**
 * The built-in aggregation function registry.
 *
 * Registering this full object opts out of tree-shaking: every built-in
 * aggregation function ends up in your bundle. Prefer importing the
 * `aggregationFn_*` functions you actually use and registering just those in
 * the `aggregationFns` slot, or passing them directly to the `aggregationFn`
 * column option.
 *
 * @deprecated Import individual `aggregationFn_*` functions instead for a
 * smaller bundle. This export still works and is not going away in v9, but
 * built-in name resolution (including `aggregationFn: 'auto'`) only finds
 * functions you register yourself.
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
