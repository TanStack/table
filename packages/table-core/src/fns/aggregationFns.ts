import { isNumberArray } from '../utils'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { AggregationFn } from '../features/column-grouping/columnGroupingFeature.types'

/**
 * Aggregation function for summing up the values of a column.
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
 * Aggregation function for finding the minimum value of a column.
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
 * Aggregation function for finding the maximum value of a column.
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
 * Aggregation function for finding the extent (min and max) of a column.
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
 * Aggregation function for finding the mean (average) of a column.
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
 * Aggregation function for finding the median value of a column.
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

  const values = leafRows.map((row) => row.getValue(columnId))
  if (!isNumberArray(values)) {
    return
  }
  if (values.length === 1) {
    return values[0]
  }

  const mid = Math.floor(values.length / 2)
  const nums = values.sort((a, b) => a - b)
  return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1]! + nums[mid]!) / 2
}

/**
 * Aggregation function for finding the unique values of a column.
 */
export const aggregationFn_unique: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))).values())
}

/**
 * Aggregation function for finding the count of unique values of a column.
 */
export const aggregationFn_uniqueCount: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<any, any>>,
) => {
  return new Set(leafRows.map((d) => d.getValue(columnId))).size
}

/**
 * Aggregation function for counting the number of rows in a column.
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
