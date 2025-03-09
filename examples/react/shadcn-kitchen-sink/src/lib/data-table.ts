import {
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_includesString,
  filterFn_lessThan,
  filterFn_lessThanOrEqualTo,
} from '@tanstack/react-table'
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
  TableFilterFeatures,
} from '@/types'
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

function isValidDate(value: unknown): boolean {
  if (value instanceof Date) return !isNaN(value.getTime())
  if (typeof value === 'string') return !isNaN(Date.parse(value))
  return false
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const date = new Date(value)
    return !isNaN(date.getTime()) ? date : null
  }
  return null
}

function isSameDay(date1: Date, date2: Date): boolean {
  const date1Str = date1.toISOString().split('T')[0]
  const date2Str = date2.toISOString().split('T')[0]
  return date1Str === date2Str
}

const filterFn_enhancedEquals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  const rowValue = row.getValue(columnId)

  if (Array.isArray(filterValue)) {
    return filterFn_arrIncludes(row, columnId, filterValue)
  }

  if (isValidDate(rowValue) && isValidDate(filterValue)) {
    const rowDate = toDate(rowValue)
    const filterDate = toDate(filterValue)

    if (rowDate && filterDate) {
      return isSameDay(rowDate, filterDate)
    }
  }

  return filterFn_equals(row, columnId, filterValue)
}

filterFn_enhancedEquals.resolveFilterValue = (val: any) => isFalsy(val)

const filterFn_enhancedGreaterThan: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  const rowValue = row.getValue(columnId)

  if (isValidDate(rowValue) && isValidDate(filterValue)) {
    const rowDate = toDate(rowValue)
    const filterDate = toDate(filterValue)

    if (rowDate && filterDate) {
      return rowDate.getTime() > filterDate.getTime()
    }
  }

  return filterFn_greaterThan(row, columnId, filterValue)
}

filterFn_enhancedGreaterThan.resolveFilterValue = (val: any) => isFalsy(val)

const filterFn_enhancedGreaterThanOrEqualTo: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  const rowValue = row.getValue(columnId)

  if (isValidDate(rowValue) && isValidDate(filterValue)) {
    const rowDate = toDate(rowValue)
    const filterDate = toDate(filterValue)

    if (rowDate && filterDate) {
      return rowDate.getTime() >= filterDate.getTime()
    }
  }

  return filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
}

filterFn_enhancedGreaterThanOrEqualTo.resolveFilterValue = (val: any) =>
  isFalsy(val)

const filterFn_enhancedLessThan: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  const rowValue = row.getValue(columnId)

  if (isValidDate(rowValue) && isValidDate(filterValue)) {
    const rowDate = toDate(rowValue)
    const filterDate = toDate(filterValue)

    if (rowDate && filterDate) {
      return rowDate.getTime() < filterDate.getTime()
    }
  }

  return filterFn_lessThan(row, columnId, filterValue)
}

filterFn_enhancedLessThan.resolveFilterValue = (val: any) => isFalsy(val)

const filterFn_enhancedLessThanOrEqualTo: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  const rowValue = row.getValue(columnId)

  if (isValidDate(rowValue) && isValidDate(filterValue)) {
    const rowDate = toDate(rowValue)
    const filterDate = toDate(filterValue)

    if (rowDate && filterDate) {
      return rowDate.getTime() <= filterDate.getTime()
    }
  }

  return filterFn_lessThanOrEqualTo(row, columnId, filterValue)
}

filterFn_enhancedLessThanOrEqualTo.resolveFilterValue = (val: any) =>
  isFalsy(val)

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

filterFn_startsWith.resolveFilterValue = (val: any) => isFalsy(val)

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

filterFn_endsWith.resolveFilterValue = (val: any) => isFalsy(val)

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

filterFn_isEmpty.resolveFilterValue = (val: any) => isFalsy(val)

const filterFn_inBetween: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  if (Array.isArray(filterValue)) {
    const [min, max] = filterValue
    const rowValue: unknown = row.getValue(columnId)

    if (min === undefined || min === '' || min === null) {
      return max === undefined || max === '' || max === null
        ? true
        : typeof rowValue === 'number' && typeof max === 'number'
          ? rowValue <= max
          : String(rowValue) <= String(max)
    }
    if (max === undefined || max === '' || max === null) {
      return typeof rowValue === 'number' && typeof min === 'number'
        ? rowValue >= min
        : String(rowValue) >= String(min)
    }

    if (
      rowValue instanceof Date ||
      (typeof rowValue === 'string' && !isNaN(Date.parse(rowValue)))
    ) {
      const dateValue = new Date(rowValue).getTime()
      const minDate = new Date(min as string | Date).getTime()
      const maxDate = new Date(max as string | Date).getTime()
      return dateValue >= minDate && dateValue <= maxDate
    }

    const numValue = Number(rowValue)
    return (
      !isNaN(numValue) && numValue >= Number(min) && numValue <= Number(max)
    )
  }
  return true
}

filterFn_inBetween.autoRemove = (val: any) => isFalsy(val)

const filterFn_isRelativeToToday: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  const rowValue = row.getValue(columnId)

  if (!isValidDate(rowValue)) return false

  const rowDate = toDate(rowValue)
  if (!rowDate) return false

  rowDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffInDays = Math.floor(
    (rowDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (typeof filterValue === 'number') {
    return diffInDays === filterValue
  } else if (typeof filterValue === 'string') {
    const numValue = parseInt(filterValue, 10)
    if (!isNaN(numValue)) {
      return diffInDays === numValue
    }
  } else if (Array.isArray(filterValue) && filterValue.length === 2) {
    const [min, max] = filterValue
    const minDays = typeof min === 'number' ? min : parseInt(min as string, 10)
    const maxDays = typeof max === 'number' ? max : parseInt(max as string, 10)

    if (!isNaN(minDays) && !isNaN(maxDays)) {
      return diffInDays >= minDays && diffInDays <= maxDays
    }
  }

  return false
}

filterFn_isRelativeToToday.autoRemove = (val: any) => isFalsy(val)

export const dynamicFilterFn: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TableFilterFeatures<TFeatures>, TData>,
  columnId: string,
  filterValue: unknown,
) => {
  let operator: FilterOperator = 'includesString'
  let value = filterValue
  let joinOperator: JoinOperator = 'and'

  const filters: Array<ExtendedColumnFilter> = row._table
    .getState()
    .columnFilters.filter((f) => f.id === columnId)

  if (!filters.length) return true

  if (filters[0].joinOperator) {
    joinOperator = filters[0].joinOperator
  }

  return filters.reduce((pass, filter, index) => {
    operator = filter.operator ?? 'includesString'
    value = filter.value

    if (isFalsy(value) && operator !== 'isEmpty' && operator !== 'isNotEmpty') {
      return pass
    }

    let result: boolean
    switch (operator) {
      case 'includesString':
        result = filterFn_includesString(row, columnId, value)
        break
      case 'notIncludesString':
        result = !filterFn_includesString(row, columnId, value)
        break
      case 'equalsString':
        result = filterFn_equalsString(row, columnId, value)
        break
      case 'notEqualsString':
        result = !filterFn_equalsString(row, columnId, value)
        break
      case 'startsWith':
        result = filterFn_startsWith(row, columnId, value)
        break
      case 'endsWith':
        result = filterFn_endsWith(row, columnId, value)
        break
      case 'isEmpty':
        result = filterFn_isEmpty(row, columnId, '')
        break
      case 'isNotEmpty':
        result = !filterFn_isEmpty(row, columnId, '')
        break
      case 'equals':
        result = filterFn_enhancedEquals(row, columnId, value)
        break
      case 'notEquals':
        result = !filterFn_enhancedEquals(row, columnId, value)
        break
      case 'greaterThan':
        result = filterFn_enhancedGreaterThan(row, columnId, value)
        break
      case 'greaterThanOrEqualTo':
        result = filterFn_enhancedGreaterThanOrEqualTo(row, columnId, value)
        break
      case 'lessThan':
        result = filterFn_enhancedLessThan(row, columnId, value)
        break
      case 'lessThanOrEqualTo':
        result = filterFn_enhancedLessThanOrEqualTo(row, columnId, value)
        break
      case 'inRange':
        result = filterFn_inBetween(row, columnId, value)
        break
      case 'isRelativeToToday':
        result = filterFn_isRelativeToToday(row, columnId, value)
        break
      default:
        result = filterFn_includesString(row, columnId, value)
        break
    }

    if (index === 0) return result

    return joinOperator === 'and' ? pass && result : pass || result
  }, true)
}

export function getFilterOperators(type: string): Array<{
  label: string
  value: FilterOperator
}> {
  switch (type) {
    case 'text':
      return [
        { label: 'contains', value: 'includesString' },
        { label: 'does not contain', value: 'notIncludesString' },
        { label: 'starts with', value: 'startsWith' },
        { label: 'ends with', value: 'endsWith' },
        { label: 'is', value: 'equalsString' },
        { label: 'is not', value: 'notEqualsString' },
        { label: 'is empty', value: 'isEmpty' },
        { label: 'is not empty', value: 'isNotEmpty' },
      ]
    case 'number':
      return [
        { label: 'is', value: 'equals' },
        { label: 'is not', value: 'notEquals' },
        { label: 'is less than', value: 'lessThan' },
        { label: 'is less than or equal to', value: 'lessThanOrEqualTo' },
        { label: 'is greater than', value: 'greaterThan' },
        { label: 'is greater than or equal to', value: 'greaterThanOrEqualTo' },
        { label: 'is between', value: 'inRange' },
      ]
    case 'date':
      return [
        { label: 'is', value: 'equals' },
        { label: 'is not', value: 'notEquals' },
        { label: 'is before', value: 'lessThan' },
        { label: 'is on or before', value: 'lessThanOrEqualTo' },
        { label: 'is after', value: 'greaterThan' },
        { label: 'is on or after', value: 'greaterThanOrEqualTo' },
        { label: 'is between', value: 'inRange' },
        { label: 'is relative to today', value: 'isRelativeToToday' },
        { label: 'is empty', value: 'isEmpty' },
        { label: 'is not empty', value: 'isNotEmpty' },
      ]
    case 'select':
    case 'multi-select':
      return [
        { label: 'is', value: 'equals' },
        { label: 'is not', value: 'notEquals' },
        { label: 'is empty', value: 'isEmpty' },
        { label: 'is not empty', value: 'isNotEmpty' },
      ]
    default:
      return [
        { label: 'contains', value: 'includesString' },
        { label: 'does not contain', value: 'notIncludesString' },
        { label: 'is', value: 'equalsString' },
        { label: 'is not', value: 'notEqualsString' },
      ]
  }
}
