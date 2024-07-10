import { isNumberArray } from '../utils'
import type { Row, RowData, TableFeatures } from '../types'
import type { AggregationFn } from '../features/column-grouping/ColumnGrouping.types'

const sum: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<TFeatures, TData>>,
  childRows: Array<Row<TFeatures, TData>>,
) => {
  // It's faster to just add the aggregations together instead of
  // process leaf nodes individually
  return childRows.reduce((sumValue, next) => {
    const nextValue = next.getValue(columnId)
    return sumValue + (typeof nextValue === 'number' ? nextValue : 0)
  }, 0)
}

const min: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<TFeatures, TData>>,
  childRows: Array<Row<TFeatures, TData>>,
) => {
  let minValue: number | undefined

  childRows.forEach((row) => {
    const value = row.getValue<number | null>(columnId)

    if (
      value != null &&
      (minValue! > value || (minValue === undefined && value >= value))
    ) {
      minValue = value
    }
  })

  return minValue
}

const max: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<TFeatures, TData>>,
  childRows: Array<Row<TFeatures, TData>>,
) => {
  let maxValue: number | undefined

  childRows.forEach((row) => {
    const value = row.getValue<number | null>(columnId)
    if (
      value != null &&
      (maxValue! < value || (maxValue === undefined && value >= value))
    ) {
      maxValue = value
    }
  })

  return maxValue
}

const extent: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  _leafRows: Array<Row<TFeatures, TData>>,
  childRows: Array<Row<TFeatures, TData>>,
) => {
  let minValue: number | undefined
  let maxValue: number | undefined

  childRows.forEach((row) => {
    const value = row.getValue<number | null>(columnId)
    if (value != null) {
      if (minValue === undefined) {
        if (value >= value) minValue = maxValue = value
      } else {
        if (minValue > value) minValue = value
        if (maxValue! < value) maxValue = value
      }
    }
  })

  return [minValue, maxValue]
}

const mean: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<TFeatures, TData>>,
) => {
  let count = 0
  let sumValue = 0

  leafRows.forEach((row) => {
    let value = row.getValue<number | null>(columnId)
    if (value != null && (value = +value) >= value) {
      ++count, (sumValue += value)
    }
  })

  if (count) return sumValue / count

  return
}

const median: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<TFeatures, TData>>,
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

const unique: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<TFeatures, TData>>,
) => {
  return Array.from(new Set(leafRows.map((d) => d.getValue(columnId))).values())
}

const uniqueCount: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  leafRows: Array<Row<TFeatures, TData>>,
) => {
  return new Set(leafRows.map((d) => d.getValue(columnId))).size
}

const count: AggregationFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  _columnId: string,
  leafRows: Array<Row<TFeatures, TData>>,
) => {
  return leafRows.length
}

export const aggregationFns = {
  sum,
  min,
  max,
  extent,
  mean,
  median,
  unique,
  uniqueCount,
  count,
}

export type BuiltInAggregationFn = keyof typeof aggregationFns
