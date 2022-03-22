import { Row } from './types'

export const reSplitAlphaNumeric = /([0-9]+)/gm

export const sortTypes = {
  alphanumeric,
  alphanumericCaseSensitive,
  text,
  textCaseSensitive,
  datetime,
  basic,
}

export type BuiltInSortType = keyof typeof sortTypes

function alphanumeric<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
  rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  columnId: string
) {
  return compareAlphanumeric(
    toString(rowA.values[columnId]).toLowerCase(),
    toString(rowB.values[columnId]).toLowerCase()
  )
}

function alphanumericCaseSensitive<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  columnId: string
) {
  return compareAlphanumeric(
    toString(rowA.values[columnId]),
    toString(rowB.values[columnId])
  )
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

// The text filter is more basic (less numeric support)
// but is much faster
function text<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
  rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  columnId: string
) {
  return compareBasic(
    toString(rowA.values[columnId]).toLowerCase(),
    toString(rowB.values[columnId]).toLowerCase()
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
function textCaseSensitive<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  columnId: string
) {
  return compareBasic(
    toString(rowA.values[columnId]),
    toString(rowB.values[columnId])
  )
}

function datetime<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
  rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  columnId: string
) {
  return compareBasic(
    (rowA.values[columnId] as Date).getTime(),
    (rowB.values[columnId] as Date).getTime()
  )
}

function basic<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
  rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  columnId: string
) {
  return compareBasic(rowA.values[columnId], rowB.values[columnId])
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
