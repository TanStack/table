import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'

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
export const sortFn_alphanumeric = <
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

/**
 * Sorts rows with the built-in alphanumeric case sensitive strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_alphanumericCaseSensitive = <
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
/**
 * Sorts rows with the built-in text strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_text = <
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
/**
 * Sorts rows with the built-in text case sensitive strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_textCaseSensitive = <
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

/**
 * Sorts rows with the built-in datetime strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
export const sortFn_datetime = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowA: Row<TFeatures, TData>,
  rowB: Row<TFeatures, TData>,
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
export const sortFn_basic = <
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
  const a = aStr.split(reSplitAlphaNumeric)
  const b = bStr.split(reSplitAlphaNumeric)

  let ai = 0
  let bi = 0
  const aLen = a.length
  const bLen = b.length

  while (ai < aLen && bi < bLen) {
    // Skip the empty boundary chunks that .filter(Boolean) used to remove
    if (!a[ai]) {
      ai++
      continue
    }
    if (!b[bi]) {
      bi++
      continue
    }

    const aa = a[ai++]!
    const bb = b[bi++]!

    // Chunks are either all-digit (parseInt always succeeds) or digit-free
    // (parseInt is always NaN), so NaN-ness fully classifies each chunk
    const an = parseInt(aa, 10)
    const bn = parseInt(bb, 10)

    const aIsNaN = isNaN(an)
    const bIsNaN = isNaN(bn)

    // Both are string
    if (aIsNaN && bIsNaN) {
      if (aa > bb) {
        return 1
      }
      if (bb > aa) {
        return -1
      }
      continue
    }

    // One is a string, one is a number — the string chunk sorts first
    if (aIsNaN || bIsNaN) {
      return aIsNaN ? -1 : 1
    }

    // Both are numbers
    if (an > bn) {
      return 1
    }
    if (bn > an) {
      return -1
    }
  }

  // One side is exhausted — compare the counts of remaining non-empty chunks
  let remaining = 0
  for (; ai < aLen; ai++) {
    if (a[ai]) {
      remaining++
    }
  }
  for (; bi < bLen; bi++) {
    if (b[bi]) {
      remaining--
    }
  }
  return remaining
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
