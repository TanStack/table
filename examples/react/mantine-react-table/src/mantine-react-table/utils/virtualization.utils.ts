import {  defaultRangeExtractor } from '@tanstack/react-virtual'
import type {Range} from '@tanstack/react-virtual';

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
