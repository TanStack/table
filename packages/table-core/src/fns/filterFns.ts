import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { FilterFn } from '../features/column-filtering/ColumnFiltering.types'

const includesString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const search = filterValue.toLowerCase()
  return Boolean(
    row
      .getValue<string | null>(columnId)
      ?.toString()
      .toLowerCase()
      .includes(search),
  )
}

includesString.autoRemove = (val: any) => testFalsey(val)

const includesStringSensitive: FilterFn<any, any> = <
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

includesStringSensitive.autoRemove = (val: any) => testFalsey(val)

const equalsString: FilterFn<any, any> = <
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

equalsString.autoRemove = (val: any) => testFalsey(val)

const arrIncludes: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue<Array<unknown>>(columnId).includes(filterValue)
}

arrIncludes.autoRemove = (val: any) => testFalsey(val) || !val?.length

const arrIncludesAll: FilterFn<any, any> = <
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

arrIncludesAll.autoRemove = (val: any) => testFalsey(val) || !val?.length

const arrIncludesSome: FilterFn<any, any> = <
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

arrIncludesSome.autoRemove = (val: any) => testFalsey(val) || !val?.length

const equals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue(columnId) === filterValue
}

equals.autoRemove = (val: any) => testFalsey(val)

const weakEquals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue(columnId) == filterValue
}

weakEquals.autoRemove = (val: any) => testFalsey(val)

const inNumberRange: FilterFn<any, any> = <
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

inNumberRange.resolveFilterValue = (val: [any, any]) => {
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

inNumberRange.autoRemove = (val: any) =>
  testFalsey(val) || (testFalsey(val[0]) && testFalsey(val[1]))

// Export

export const filterFns = {
  includesString,
  includesStringSensitive,
  equalsString,
  arrIncludes,
  arrIncludesAll,
  arrIncludesSome,
  equals,
  weakEquals,
  inNumberRange,
}

export type BuiltInFilterFn = keyof typeof filterFns

// Utils

function testFalsey(val: any) {
  return val === undefined || val === null || val === ''
}
