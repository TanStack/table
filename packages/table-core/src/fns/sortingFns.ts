import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { SortingFn } from '../features/row-sorting/rowSortingFeature.types'

export const reSplitAlphaNumeric = /([0-9]+)/gm

export const sortingFn_alphanumeric: SortingFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
) => {
  return compareAlphanumeric(
    toString(rowA.getValue(columnId)).toLowerCase(),
    toString(rowB.getValue(columnId)).toLowerCase(),
  )
}

export const sortingFn_alphanumericCaseSensitive: SortingFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
) => {
  return compareAlphanumeric(
    toString(rowA.getValue(columnId)),
    toString(rowB.getValue(columnId)),
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
export const sortingFn_text: SortingFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
) => {
  return compareBasic(
    toString(rowA.getValue(columnId)).toLowerCase(),
    toString(rowB.getValue(columnId)).toLowerCase(),
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
export const sortingFn_textCaseSensitive: SortingFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
) => {
  return compareBasic(
    toString(rowA.getValue(columnId)),
    toString(rowB.getValue(columnId)),
  )
}

export const sortingFn_datetime: SortingFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
) => {
  const a = rowA.getValue<Date>(columnId)
  const b = rowB.getValue<Date>(columnId)

  // Can handle nullish values
  // Use > and < because == (and ===) doesn't work with
  // Date objects (would require calling getTime()).
  return a > b ? 1 : a < b ? -1 : 0
}

export const sortingFn_basic: SortingFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
  columnId: string,
) => {
  return compareBasic(rowA.getValue(columnId), rowB.getValue(columnId))
}

// Utils

function compareBasic(a: any, b: any) {
  return a === b ? 0 : a > b ? 1 : -1
}

function toString(a: any) {
  if (typeof a === 'number') {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return ''
    }
    return String(a)
  }
  if (typeof a === 'string') {
    return a
  }
  return ''
}

// Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity
function compareAlphanumeric(aStr: string, bStr: string) {
  // Split on number groups, but keep the delimiter
  // Then remove falsey split values
  const a = aStr.split(reSplitAlphaNumeric).filter(Boolean)
  const b = bStr.split(reSplitAlphaNumeric).filter(Boolean)

  // While
  while (a.length && b.length) {
    const aa = a.shift()!
    const bb = b.shift()!

    const an = parseInt(aa, 10)
    const bn = parseInt(bb, 10)

    const combo = [an, bn].sort()

    // Both are string
    if (isNaN(combo[0]!)) {
      if (aa > bb) {
        return 1
      }
      if (bb > aa) {
        return -1
      }
      continue
    }

    // One is a string, one is a number
    if (isNaN(combo[1]!)) {
      return isNaN(an) ? -1 : 1
    }

    // Both are numbers
    if (an > bn) {
      return 1
    }
    if (bn > an) {
      return -1
    }
  }

  return a.length - b.length
}

// Exports

export const sortingFns = {
  alphanumeric: sortingFn_alphanumeric,
  alphanumericCaseSensitive: sortingFn_alphanumericCaseSensitive,
  basic: sortingFn_basic,
  datetime: sortingFn_datetime,
  text: sortingFn_text,
  textCaseSensitive: sortingFn_textCaseSensitive,
}

export type BuiltInSortingFn = keyof typeof sortingFns
