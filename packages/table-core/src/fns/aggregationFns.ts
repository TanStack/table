import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { AggregationFn } from '../features/column-grouping/columnGroupingFeature.types'

/**
 * Sums numeric child-row values for a grouped column.
 *
 * Non-number values contribute `0`. Child rows are used so nested group totals
 * can reuse already aggregated values.
 */
export const aggregationFn_sum: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<any, any>>,
  childRows: Array<Row<any, any>>,
) => {
  // It's faster to just add the aggregations together instead of
  // process leaf nodes individually
  return childRows.reduce((sumValue, next) => {
    const nextValue = next.getValue(columnId)
    return sumValue + (typeof nextValue === 'number' ? nextValue : 0)
  }, 0)
}

/**
 * Finds the minimum numeric child-row value for a grouped column.
 *
 * Nullish and non-number values are ignored. Returns `undefined` when no
 * numeric value is found.
 */
export const aggregationFn_min: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<any, any>>,
  childRows: Array<Row<any, any>>,
) => {
  let minValue: number | undefined

  childRows.forEach((row) => {
    const value = row.getValue(columnId)

    if (
      value != null &&
      typeof value === 'number' &&
      (minValue === undefined || value < minValue)
    ) {
      minValue = value
    }
  })

  return minValue
}

/**
 * Finds the maximum numeric child-row value for a grouped column.
 *
 * Nullish and non-number values are ignored. Returns `undefined` when no
 * numeric value is found.
 */
export const aggregationFn_max: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<any, any>>,
  childRows: Array<Row<any, any>>,
) => {
  let maxValue: number | undefined

  childRows.forEach((row) => {
    const value = row.getValue(columnId)
    if (
      value != null &&
      typeof value === 'number' &&
      (maxValue === undefined || value > maxValue)
    ) {
      maxValue = value
    }
  })

  return maxValue
}

/**
 * Finds the numeric extent for a grouped column.
 *
 * Returns `[min, max]`, where each entry is `undefined` when no numeric value is
 * present.
 */
export const aggregationFn_extent: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<any, any>>,
  childRows: Array<Row<any, any>>,
) => {
  let minValue: number | undefined
  let maxValue: number | undefined

  childRows.forEach((row) => {
    const value = row.getValue(columnId)
    if (value != null && typeof value === 'number') {
      if (minValue === undefined) {
        minValue = maxValue = value
      } else {
        if (minValue > value) minValue = value
        if (maxValue! < value) maxValue = value
      }
    }
  })

  return [minValue, maxValue]
}

/**
 * Averages numeric leaf-row values for a grouped column.
 *
 * Number-like values are coerced with unary `+`; nullish and non-numeric values
 * are ignored.
 */
export const aggregationFn_mean: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  let count = 0
  let sumValue = 0

  leafRows.forEach((row) => {
    const value = row.getValue(columnId)
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
  })

  if (count) return sumValue / count

  return
}

/**
 * Computes the median of numeric leaf-row values for a grouped column.
 *
 * All values must be numbers. If any value is non-numeric, or no leaf rows are
 * present, the result is `undefined`.
 */
export const aggregationFn_median: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  if (!leafRows.length) {
    return
  }

  const values: Array<number> = new Array(leafRows.length)
  for (let i = 0; i < leafRows.length; i++) {
    const v = leafRows[i]!.getValue(columnId)
    if (typeof v !== 'number') return
    values[i] = v
  }

  if (values.length === 1) {
    return values[0]
  }

  const mid = Math.floor(values.length / 2)
  values.sort((a, b) => a - b)
  return values.length % 2 !== 0
    ? values[mid]
    : (values[mid - 1]! + values[mid]!) / 2
}

/**
 * Collects unique leaf-row values for a grouped column.
 *
 * Values are compared with JavaScript `Set` semantics.
 */
export const aggregationFn_unique: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  const set = new Set<unknown>()
  for (let i = 0; i < leafRows.length; i++) {
    set.add(leafRows[i]!.getValue(columnId))
  }
  return Array.from(set.values())
}

/**
 * Counts unique leaf-row values for a grouped column.
 *
 * Values are compared with JavaScript `Set` semantics.
 */
export const aggregationFn_uniqueCount: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  const set = new Set<unknown>()
  for (let i = 0; i < leafRows.length; i++) {
    set.add(leafRows[i]!.getValue(columnId))
  }
  return set.size
}

/**
 * Counts the number of leaf rows in the group.
 *
 * The column id is ignored because the result is based only on group size.
 */
export const aggregationFn_count: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  _columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  return leafRows.length
}

/**
 * The built-in aggregation function registry.
 *
 * Pass this object to grouped row model creation or extend it with custom aggregation functions for grouped columns.
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
}

export type BuiltInAggregationFn = keyof typeof aggregationFns
