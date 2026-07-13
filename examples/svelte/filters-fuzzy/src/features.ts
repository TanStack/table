import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/svelte-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { FilterFn, SortFn, TableFeatures } from '@tanstack/svelte-table'
import type { Person } from './makeData'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

export const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank as RankingInfo,
      rowB.columnFiltersMeta[columnId].itemRank as RankingInfo,
    )
  }
  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir
}

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    equalsString: filterFn_equalsString,
    fuzzy: fuzzyFilter,
    includesString: filterFn_includesString,
    includesStringSensitive: filterFn_includesStringSensitive,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    fuzzy: fuzzySort,
    text: sortFn_text,
  },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})
