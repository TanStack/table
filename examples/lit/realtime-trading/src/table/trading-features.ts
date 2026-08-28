import {
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
} from '@tanstack/lit-table'

export const tradingFeatures = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})
