import type {
  FilterFn,
  FilterMeta,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/main'

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

// Dynamic filter function that uses the operator property to select the appropriate filter function
export const dynamicFilterFn: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
  addMeta?: (meta: FilterMeta) => void,
) => {
  // Extract the operator from the filter value if it's an ExtendedColumnFilter
  let operator = 'includesString' // Default to includesString
  let value = filterValue

  // Check if filterValue is an object with an operator property
  if (
    filterValue &&
    typeof filterValue === 'object' &&
    'operator' in filterValue
  ) {
    const extendedFilter = filterValue as ExtendedColumnFilter
    operator = extendedFilter.operator || operator
    value = extendedFilter.value
  }

  // Store the operator in meta for debugging or other uses
  if (addMeta) {
    addMeta({ operator })
  }

  // Use the appropriate filter function based on the operator
  switch (operator) {
    case 'notIncludesString':
      return filterFn_notIncludesString(row, columnId, value as string, addMeta)
    case 'equalsString':
      return !filterFn_notEqualsString(row, columnId, value as string)
    case 'notEqualsString':
      return filterFn_notEqualsString(row, columnId, value as string)
    case 'startsWith':
      return filterFn_startsWith(row, columnId, value as string)
    case 'endsWith':
      return filterFn_endsWith(row, columnId, value as string)
    case 'isEmpty':
      return filterFn_isEmpty(row, columnId, '' as string)
    case 'isNotEmpty':
      return filterFn_isNotEmpty(row, columnId, '' as string)
    case 'equals-true':
      return filterFn_equalsTrue(row, columnId, '' as string)
    case 'equals-false':
      return filterFn_equalsFalse(row, columnId, '' as string)
    case 'includesString':
    default:
      // Default to the built-in includesString filter
      const stringValue = String(row.getValue(columnId) ?? '').toLowerCase()
      return stringValue.includes(String(value ?? '').toLowerCase())
  }
}
