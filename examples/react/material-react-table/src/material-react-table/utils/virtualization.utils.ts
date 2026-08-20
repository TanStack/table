import { defaultRangeExtractor } from '@tanstack/react-virtual'
import type { Range } from '@tanstack/react-virtual'

/**
 * When scroll, the `draggingRow` or `draggingColumn` can be removed from document because of virtualization,
 * then, the `dragEnd` event on `MRT_TableBodyRowGrabHandle` or `MRT_TableHeadCellGrabHandle` will not fire.
 * We should keep the `draggingRow` or `draggingColumn` in `getVirtualItems()` to avoid this thing.
 */
export const extraIndexRangeExtractor = (
  range: Range,
  draggingIndex?: number,
) => {
  const newIndexes = defaultRangeExtractor(range)
  if (draggingIndex === undefined) return newIndexes
  if (
    draggingIndex >= 0 &&
    draggingIndex < Math.max(range.startIndex - range.overscan, 0)
  ) {
    newIndexes.unshift(draggingIndex)
  }
  if (draggingIndex >= 0 && draggingIndex > range.endIndex + range.overscan) {
    newIndexes.push(draggingIndex)
  }
  return newIndexes
}
