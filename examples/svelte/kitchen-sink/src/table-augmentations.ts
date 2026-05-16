import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type {
  CellData,
  FilterFn,
  RowData,
  TableFeatures,
  stockFeatures,
} from '@tanstack/svelte-table'
import type { Person } from './makeData'

declare module '@tanstack/svelte-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }

  interface FilterFns {
    fuzzy: FilterFn<typeof stockFeatures, Person>
  }

  interface FilterMeta {
    itemRank?: RankingInfo
  }
}
