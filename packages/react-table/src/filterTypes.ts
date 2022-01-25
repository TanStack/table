import { AccessorFn, Row } from './types'

export const filterTypes = {
  includesString,
  includesStringSensitive,
  equalsString,
  equalsStringSensitive,
  arrIncludes,
  arrIncludesAll,
  equals,
  weakEquals,
  betweenNumberRange,
}

export type BuiltInFilterType = keyof typeof filterTypes

function includesString<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  const search = String(filterValue).toLowerCase()

  rows = rows.filter(row => {
    return columnIds.some(id => {
      return String(row.values[id]).toLowerCase().includes(search)
    })
  })
  return rows
}

includesString.autoRemove = (val: any) => testFalsey(val)

function includesStringSensitive<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  const search = String(filterValue)

  rows = rows.filter(row => {
    return columnIds.some(id => {
      return String(row.values[id]).includes(search)
    })
  })
  return rows
}

includesStringSensitive.autoRemove = (val: any) => testFalsey(val)

function equalsString<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  const search = String(filterValue).toLowerCase()

  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      return rowValue !== undefined
        ? String(rowValue).toLowerCase() === search
        : true
    })
  })
}

equalsString.autoRemove = (val: any) => testFalsey(val)

function equalsStringSensitive<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  const search = String(filterValue)
  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      return rowValue !== undefined ? String(rowValue) === search : true
    })
  })
}

equalsStringSensitive.autoRemove = (val: any) => testFalsey(val)

function arrIncludes<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      return rowValue.includes(filterValue)
    })
  })
}

arrIncludes.autoRemove = (val: any) => testFalsey(val) || !val?.length

function arrIncludesAll<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown[]
) {
  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      return (
        rowValue &&
        rowValue.length &&
        filterValue.every(val => rowValue.includes(val))
      )
    })
  })
}

arrIncludesAll.autoRemove = (val: any) => testFalsey(val) || !val?.length

function equals<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      return rowValue === filterValue
    })
  })
}

equals.autoRemove = (val: any) => testFalsey(val)

function weakEquals<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: unknown
) {
  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      // eslint-disable-next-line eqeqeq
      return rowValue == filterValue
    })
  })
}

weakEquals.autoRemove = (val: any) => testFalsey(val)

function betweenNumberRange<
  TData,
  TValue,
  TAccessor extends AccessorFn<TData>,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnIds: string[],
  filterValue: [unknown, unknown]
) {
  let [unsafeMin, unsafeMax] = filterValue || []

  let parsedMin =
    typeof unsafeMin !== 'number' ? parseFloat(unsafeMin as string) : unsafeMin
  let parsedMax =
    typeof unsafeMax !== 'number' ? parseFloat(unsafeMax as string) : unsafeMax

  let min =
    unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin
  let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax

  if (min > max) {
    const temp = min
    min = max
    max = temp
  }

  return rows.filter(row => {
    return columnIds.some(id => {
      const rowValue = row.values[id]
      return rowValue >= min && rowValue <= max
    })
  })
}

betweenNumberRange.autoRemove = (val: any) =>
  testFalsey(val) || (testFalsey(val[0]) && testFalsey(val[1]))

// Utils

function testFalsey(val: any) {
  return val === undefined || val === null || val === ''
}
