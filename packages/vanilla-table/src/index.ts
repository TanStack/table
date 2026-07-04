import { rankItem } from '@tanstack/match-sorter-utils'
import type { FilterFn } from '@tanstack/table-core'

export * from './vanillaTable.js'
export {
  Virtualizer,
  type VirtualizerOptions,
  type VirtualItem,
} from './utils/virtualizer.js'

export const fuzzyFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}
