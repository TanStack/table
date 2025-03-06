import type {
  FilterFn,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/react-table'

// Custom filter functions to complement the built-in TanStack filter functions

export const filterFn_notIncludesString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return !value.includes(String(filterValue ?? '').toLowerCase())
}

export const filterFn_notEqualsString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value !== String(filterValue ?? '').toLowerCase()
}

export const filterFn_startsWith: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value.startsWith(String(filterValue ?? '').toLowerCase())
}

export const filterFn_endsWith: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value.endsWith(String(filterValue ?? '').toLowerCase())
}

export const filterFn_isEmpty: FilterFn<any, any> = <
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

export const filterFn_isNotEmpty: FilterFn<any, any> = <
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

// Custom boolean filter functions
export const filterFn_equalsTrue: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
) => {
  return row.getValue(columnId) === true
}

export const filterFn_equalsFalse: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
) => {
  return row.getValue(columnId) === false
}

// Custom filter functions mapping object
export const customFilterFns = {
  notIncludesString: filterFn_notIncludesString,
  notEqualsString: filterFn_notEqualsString,
  startsWith: filterFn_startsWith,
  endsWith: filterFn_endsWith,
  isEmpty: filterFn_isEmpty,
  isNotEmpty: filterFn_isNotEmpty,
  'equals-true': filterFn_equalsTrue,
  'equals-false': filterFn_equalsFalse,
}
