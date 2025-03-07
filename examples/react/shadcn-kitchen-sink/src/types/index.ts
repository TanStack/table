import type { ColumnFilter, filterFns } from '@tanstack/react-table'

export type FilterOperator =
  | keyof typeof filterFns
  | 'notIncludesString'
  | 'notEqualsString'
  | 'notEquals'
  | 'greaterThan'
  | 'notGreaterThan'
  | 'greaterThanOrEqualTo'
  | 'notGreaterThanOrEqualTo'
  | 'lessThan'
  | 'notLessThan'
  | 'lessThanOrEqualTo'
  | 'notLessThanOrEqualTo'
  | 'isRelativeToToday'
  | 'inNumberRange'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'

export interface ExtendedColumnFilter extends ColumnFilter {
  filterId?: string
  operator?: FilterOperator
}
