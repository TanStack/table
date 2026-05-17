import { SortingFn } from './features/RowSorting'

/**
 * @deprecated No longer used internally. Kept for backwards compatibility.
 */
export const reSplitAlphaNumeric = /([0-9]+)/gm

const alphanumeric: SortingFn<any> = (rowA, rowB, columnId) => {
  return compareAlphanumeric(
    toString(rowA.getValue(columnId)).toLowerCase(),
    toString(rowB.getValue(columnId)).toLowerCase(),
  )
}

const alphanumericCaseSensitive: SortingFn<any> = (rowA, rowB, columnId) => {
  return compareAlphanumeric(
    toString(rowA.getValue(columnId)),
    toString(rowB.getValue(columnId)),
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
const text: SortingFn<any> = (rowA, rowB, columnId) => {
  return compareBasic(
    toString(rowA.getValue(columnId)).toLowerCase(),
    toString(rowB.getValue(columnId)).toLowerCase(),
  )
}

// The text filter is more basic (less numeric support)
// but is much faster
const textCaseSensitive: SortingFn<any> = (rowA, rowB, columnId) => {
  return compareBasic(
    toString(rowA.getValue(columnId)),
    toString(rowB.getValue(columnId)),
  )
}

const datetime: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = rowA.getValue<Date>(columnId)
  const b = rowB.getValue<Date>(columnId)

  // Can handle nullish values
  // Use > and < because == (and ===) doesn't work with
  // Date objects (would require calling getTime()).
  return a > b ? 1 : a < b ? -1 : 0
}

const basic: SortingFn<any> = (rowA, rowB, columnId) => {
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

function isDigitChar(ch: string): boolean {
  return ch >= '0' && ch <= '9'
}

// Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity
//
// Uses a character-by-character approach to ensure consistent ordering
// between letters and digits regardless of their position in the string.
// Letters always sort before digits (e.g. "appleA" < "apple1").
function compareAlphanumeric(aStr: string, bStr: string) {
  let ai = 0
  let bi = 0

  while (ai < aStr.length && bi < bStr.length) {
    const aIsDigit = isDigitChar(aStr[ai]!)
    const bIsDigit = isDigitChar(bStr[bi]!)

    if (aIsDigit && bIsDigit) {
      // Both are digits - extract full numeric sequences and compare as numbers
      let aNumStr = ''
      let bNumStr = ''
      while (ai < aStr.length && isDigitChar(aStr[ai]!)) {
        aNumStr += aStr[ai]
        ai++
      }
      while (bi < bStr.length && isDigitChar(bStr[bi]!)) {
        bNumStr += bStr[bi]
        bi++
      }
      const diff = parseInt(aNumStr, 10) - parseInt(bNumStr, 10)
      if (diff !== 0) {
        return diff
      }
    } else if (aIsDigit !== bIsDigit) {
      // One is a digit, one is a letter - letters sort before digits
      return aIsDigit ? 1 : -1
    } else {
      // Both are non-digit characters - compare lexicographically
      if (aStr[ai]! > bStr[bi]!) {
        return 1
      }
      if (aStr[ai]! < bStr[bi]!) {
        return -1
      }
      ai++
      bi++
    }
  }

  return aStr.length - bStr.length
}

// Exports

export const sortingFns = {
  alphanumeric,
  alphanumericCaseSensitive,
  text,
  textCaseSensitive,
  datetime,
  basic,
}

export type BuiltInSortingFn = keyof typeof sortingFns
