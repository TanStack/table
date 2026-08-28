import {
  createSortedRowModel,
  stockFeatures,
  tableFeatures,
} from '@tanstack/angular-table'

export const tradingFeatures = tableFeatures({
  ...stockFeatures,
  sortedRowModel: createSortedRowModel(),
})
