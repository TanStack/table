import { makeObjectMap } from '../../utils'
import type { Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

/**
 * Display order for column pinning, shared through the `orderByColumnPinning`
 * feature stub so that the core headers, row visible cells, and cell selection
 * don't bundle it when the column pinning feature is not registered.
 *
 * Internal: not exported from any package entry point.
 */

/**
 * Orders items that each belong to a leaf column, such as visible leaf
 * columns or a row's visible cells: start-pinned items in pinning order, then
 * unpinned items in their given order, then end-pinned items in pinning order.
 * Pinned ids that match no item are skipped.
 *
 * `getItemsByColumnId` can return an existing lookup of the same items, which
 * is only read when something is pinned.
 */
export function orderByColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TItem,
>(
  table: Table_Internal<TFeatures, TData>,
  items: Array<TItem>,
  getColumnId: (item: TItem) => string,
  getItemsByColumnId?: () => Record<string, TItem | undefined>,
): Array<TItem> {
  const columnPinning = table.atoms.columnPinning?.get()
  if (
    !columnPinning ||
    (!columnPinning.start.length && !columnPinning.end.length)
  ) {
    return items
  }
  const { start, end } = columnPinning

  let itemsByColumnId = getItemsByColumnId?.()
  if (!itemsByColumnId) {
    itemsByColumnId = makeObjectMap<TItem>()
    for (let i = 0; i < items.length; i++) {
      itemsByColumnId[getColumnId(items[i]!)] = items[i]!
    }
  }

  const ordered: Array<TItem> = []
  for (let i = 0; i < start.length; i++) {
    const item = itemsByColumnId[start[i]!]
    if (item) ordered.push(item)
  }
  for (let i = 0; i < items.length; i++) {
    const columnId = getColumnId(items[i]!)
    if (!start.includes(columnId) && !end.includes(columnId)) {
      ordered.push(items[i]!)
    }
  }
  for (let i = 0; i < end.length; i++) {
    const item = itemsByColumnId[end[i]!]
    if (item) ordered.push(item)
  }
  return ordered
}
