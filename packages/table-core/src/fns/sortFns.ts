import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { SortFn } from '../features/row-sorting/rowSortingFeature.types'

/**
 * Regular expression used to split mixed text and numeric chunks.
 *
 * The alphanumeric sort functions use these chunks for natural sorting of
 * strings like `item2` before `item10`.
 */
export const reSplitAlphaNumeric = /([0-9]+)/gm

/**
 * Sorts rows with the built-in alphanumeric strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_alphanumeric: SortFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<any, any>,
  rowB: Row<any, any>,
  columnId: string,
) => {
  return compareAlphanumeric(
    toString(rowA.getValue(columnId)).toLowerCase(),
    toString(rowB.getValue(columnId)).toLowerCase(),
  )
}

/**
 * Sorts rows with the built-in alphanumeric case sensitive strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_alphanumericCaseSensitive: SortFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<any, any>,
  rowB: Row<any, any>,
  columnId: string,
) => {
  return compareAlphanumeric(
    toString(rowA.getValue(columnId)),
    toString(rowB.getValue(columnId)),
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
/**
 * Sorts rows with the built-in text strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_text: SortFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<any, any>,
  rowB: Row<any, any>,
  columnId: string,
) => {
  return compareBasic(
    toString(rowA.getValue(columnId)).toLowerCase(),
    toString(rowB.getValue(columnId)).toLowerCase(),
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
/**
 * Sorts rows with the built-in text case sensitive strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_textCaseSensitive: SortFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<any, any>,
  rowB: Row<any, any>,
  columnId: string,
) => {
  return compareBasic(
    toString(rowA.getValue(columnId)),
    toString(rowB.getValue(columnId)),
  )
}

/**
 * Sorts rows with the built-in datetime strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_datetime: SortFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<any, any>,
  rowB: Row<any, any>,
  columnId: string,
) => {
  const a: number | string = rowA.getValue(columnId)
  const b: number | string = rowB.getValue(columnId)

  // Can handle nullish values
  // Use > and < because == (and ===) doesn't work with
  // Date objects (would require calling getTime()).
  return a > b ? 1 : a < b ? -1 : 0
}

/**
 * Sorts rows with the built-in basic strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_basic: SortFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<any, any>,
  rowB: Row<any, any>,
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

  let ai = 0
  let bi = 0
  const aLen = a.length
  const bLen = b.length

  while (ai < aLen && bi < bLen) {
    const aa = a[ai++]!
    const bb = b[bi++]!

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

  return aLen - ai - (bLen - bi)
}

// Exports

/**
 * The built-in sorting function registry.
 *
 * Pass this object to sorted row model creation or extend it with custom sorting functions.
 */
export const sortFns = {
  alphanumeric: sortFn_alphanumeric,
  alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
  basic: sortFn_basic,
  datetime: sortFn_datetime,
  text: sortFn_text,
  textCaseSensitive: sortFn_textCaseSensitive,
}

export type BuiltInSortFn = keyof typeof sortFns
