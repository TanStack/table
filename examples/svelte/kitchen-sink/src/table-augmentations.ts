import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { FilterFn, RowData, stockFeatures } from '@tanstack/svelte-table'

declare module '@tanstack/svelte-table' {
  interface FilterFns {
    fuzzy: FilterFn<typeof stockFeatures, RowData>
  }

  interface FilterMeta {
    itemRank?: RankingInfo
  }
}
