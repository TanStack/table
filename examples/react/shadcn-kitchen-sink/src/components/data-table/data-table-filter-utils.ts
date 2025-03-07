import type {
  FilterFn,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '../../main'

function testFalsy(val: unknown) {
  return (
    val === undefined ||
    val === null ||
    val === '' ||
    (Array.isArray(val) && val.length === 0)
  )
}

const filterFn_notIncludesString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  if (testFalsy(filterValue)) return true
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return !value.includes(String(filterValue ?? '').toLowerCase())
}

filterFn_notIncludesString.autoRemove = (val: any) => testFalsy(val)

const filterFn_notEqualsString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  if (testFalsy(filterValue)) return true
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value !== String(filterValue ?? '').toLowerCase()
}

filterFn_notEqualsString.autoRemove = (val: any) => testFalsy(val)

const filterFn_startsWith: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  if (testFalsy(filterValue)) return true
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value.startsWith(String(filterValue ?? '').toLowerCase())
}

filterFn_startsWith.autoRemove = (val: any) => testFalsy(val)

const filterFn_endsWith: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: string,
) => {
  if (testFalsy(filterValue)) return true
  const value = String(row.getValue(columnId) ?? '').toLowerCase()
  return value.endsWith(String(filterValue ?? '').toLowerCase())
}

filterFn_endsWith.autoRemove = (val: any) => testFalsy(val)

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

filterFn_isEmpty.autoRemove = (val: any) => testFalsy(val)

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

filterFn_isNotEmpty.autoRemove = (val: any) => testFalsy(val)

const filterFn_equalsTrue: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
) => {
  return row.getValue(columnId) === true
}

filterFn_equalsTrue.autoRemove = (val: any) => testFalsy(val)

const filterFn_equalsFalse: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
) => {
  return row.getValue(columnId) === false
}

filterFn_equalsFalse.autoRemove = (val: any) => testFalsy(val)

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

export const dynamicFilterFn: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<Pick<TFeatures, 'columnFilteringFeature'>, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  let operator = 'includesString'
  let value = filterValue

  const filter: ExtendedColumnFilter | undefined = row._table
    .getState()
    .columnFilters.find((f) => f.id === columnId)

  if (filter && filter.operator) {
    operator = filter.operator
    value = filter.value
  } else if (
    filterValue &&
    typeof filterValue === 'object' &&
    'operator' in filterValue
  ) {
    const extendedFilter = filterValue as { operator?: string; value: unknown }
    operator = extendedFilter.operator || operator
    value = extendedFilter.value
  }

  // Skip filtering if value is empty (except for isEmpty and isNotEmpty operators)
  if (
    testFalsy(value) &&
    operator !== 'isEmpty' &&
    operator !== 'isNotEmpty' &&
    operator !== 'equals-true' &&
    operator !== 'equals-false'
  ) {
    return true
  }

  switch (operator) {
    case 'notIncludesString':
      return filterFn_notIncludesString(row, columnId, value as string)
    case 'equalsString':
      if (testFalsy(value)) return true
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
      if (testFalsy(value)) return true
      const stringValue = String(row.getValue(columnId) ?? '').toLowerCase()
      return stringValue.includes(String(value ?? '').toLowerCase())
  }
}
