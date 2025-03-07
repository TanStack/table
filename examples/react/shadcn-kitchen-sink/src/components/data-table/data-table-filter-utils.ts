import {
  filterFn_equals,
  filterFn_equalsString,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_lessThan,
  filterFn_lessThanOrEqualTo,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter, FilterOperator } from '@/types'
import type {
  FilterFn,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/react-table'

function isFalsy(val: unknown) {
  return (
    val === undefined ||
    val === null ||
    val === '' ||
    (Array.isArray(val) && val.length === 0)
  )
}

const filterFn_startsWith: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value.startsWith(filterValue.toLowerCase())
}

filterFn_startsWith.autoRemove = (val: any) => isFalsy(val)

const filterFn_endsWith: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value.endsWith(filterValue.toLowerCase())
}

filterFn_endsWith.autoRemove = (val: any) => isFalsy(val)

const filterFn_isEmpty: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
) => {
  const value = row.getValue(columnId)
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

filterFn_isEmpty.autoRemove = (val: any) => isFalsy(val)

const filterFn_isNotEmpty: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
) => {
  const value = row.getValue(columnId)
  return !(
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

filterFn_isNotEmpty.autoRemove = (val: any) => isFalsy(val)

export const dynamicFilterFn: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<Pick<TFeatures, 'columnFilteringFeature'>, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  let operator: FilterOperator = 'includesString'
  let value = filterValue

  const filter = row._table
    .getState()
    .columnFilters.find((f) => f.id === columnId) as
    | ExtendedColumnFilter
    | undefined

  if (!filter) return true

  operator = filter.operator ?? operator
  value = filter.value

  if (isFalsy(value) && operator !== 'isEmpty' && operator !== 'isNotEmpty') {
    return true
  }

  switch (operator) {
    case 'includesString':
      return filterFn_includesString(row, columnId, value)
    case 'notIncludesString':
      return !filterFn_includesString(row, columnId, value)
    case 'equalsString':
      return filterFn_equalsString(row, columnId, value)
    case 'notEqualsString':
      return !filterFn_equalsString(row, columnId, value)
    case 'startsWith':
      return filterFn_startsWith(row, columnId, value)
    case 'endsWith':
      return filterFn_endsWith(row, columnId, value)
    case 'isEmpty':
      return filterFn_isEmpty(row, columnId, '')
    case 'isNotEmpty':
      return filterFn_isNotEmpty(row, columnId, '')
    case 'equals':
      return filterFn_equals(row, columnId, value)
    case 'notEquals':
      return !filterFn_equals(row, columnId, value)
    case 'greaterThan':
      return filterFn_greaterThan(row, columnId, value)
    case 'greaterThanOrEqualTo':
      return filterFn_greaterThanOrEqualTo(row, columnId, value)
    case 'lessThan':
      return filterFn_lessThan(row, columnId, value)
    case 'lessThanOrEqualTo':
      return filterFn_lessThanOrEqualTo(row, columnId, value)
    case 'inNumberRange':
      return filterFn_inNumberRange(row, columnId, value)
    default:
      return filterFn_includesString(row, columnId, value)
  }
}
