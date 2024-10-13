import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { FilterFn } from '../features/column-filtering/ColumnFiltering.types'

export const filterFn_includesString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const search = filterValue.toString().toLowerCase()
  return Boolean(
    row
      .getValue<string | null>(columnId)
      ?.toString()
      .toLowerCase()
      .includes(search),
  )
}

filterFn_includesString.autoRemove = (val: any) => testFalsy(val)

export const filterFn_includesStringSensitive: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  return Boolean(
    row.getValue<string | null>(columnId)?.toString().includes(filterValue),
  )
}

filterFn_includesStringSensitive.autoRemove = (val: any) => testFalsy(val)

export const filterFn_equalsString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  return (
    row.getValue<string | null>(columnId)?.toString().toLowerCase() ===
    filterValue.toLowerCase()
  )
}

filterFn_equalsString.autoRemove = (val: any) => testFalsy(val)

export const filterFn_arrIncludes: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue<Array<unknown>>(columnId).includes(filterValue)
}

filterFn_arrIncludes.autoRemove = (val: any) => testFalsy(val) || !val?.length

export const filterFn_arrIncludesAll: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: Array<unknown>,
) => {
  return !filterValue.some(
    (val) => !row.getValue<Array<unknown>>(columnId).includes(val),
  )
}

filterFn_arrIncludesAll.autoRemove = (val: any) =>
  testFalsy(val) || !val?.length

export const filterFn_arrIncludesSome: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: Array<unknown>,
) => {
  return filterValue.some((val) =>
    row.getValue<Array<unknown>>(columnId).includes(val),
  )
}

filterFn_arrIncludesSome.autoRemove = (val: any) =>
  testFalsy(val) || !val?.length

export const filterFn_equals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue(columnId) === filterValue
}

filterFn_equals.autoRemove = (val: any) => testFalsy(val)

export const filterFn_weakEquals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue(columnId) == filterValue
}

filterFn_weakEquals.autoRemove = (val: any) => testFalsy(val)

export const filterFn_inNumberRange: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: [number, number],
) => {
  const [min, max] = filterValue

  const rowValue = row.getValue<number>(columnId)
  return rowValue >= min && rowValue <= max
}

filterFn_inNumberRange.resolveFilterValue = (val: [any, any]) => {
  const [unsafeMin, unsafeMax] = val

  const parsedMin =
    typeof unsafeMin !== 'number' ? parseFloat(unsafeMin as string) : unsafeMin
  const parsedMax =
    typeof unsafeMax !== 'number' ? parseFloat(unsafeMax as string) : unsafeMax

  let min =
    unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin
  let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax

  if (min > max) {
    const temp = min
    min = max
    max = temp
  }

  return [min, max] as const
}

filterFn_inNumberRange.autoRemove = (val: any) =>
  testFalsy(val) || (testFalsy(val[0]) && testFalsy(val[1]))

// Export

export const filterFns = {
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  equalsString: filterFn_equalsString,
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrIncludesSome: filterFn_arrIncludesSome,
  equals: filterFn_equals,
  weakEquals: filterFn_weakEquals,
  inNumberRange: filterFn_inNumberRange,
}

export type BuiltInFilterFn = keyof typeof filterFns

// Utils

function testFalsy(val: any) {
  return val === undefined || val === null || val === ''
}
