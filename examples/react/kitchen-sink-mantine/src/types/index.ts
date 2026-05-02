import type {
  ColumnFilter,
  TableFeatures,
  filterFns,
} from '@tanstack/react-table'

export type TableFilterFeatures<TFeatures extends TableFeatures> = Pick<
  TFeatures,
  'columnFilteringFeature' | 'columnFacetingFeature'
>

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
  | 'inRange'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'

export type JoinOperator = 'and' | 'or'

export interface ExtendedColumnFilter extends ColumnFilter {
  filterId?: string
  operator?: FilterOperator
  joinOperator?: JoinOperator
}
