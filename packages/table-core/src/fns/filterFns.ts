import type {
  CreatedFilterFn,
  ExtractFilterMeta,
  FilterFnDef,
} from '../features/column-filtering/columnFilteringFeature.types'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'

/**
 * Builds a `FilterFn` from a value-level comparator plus optional resolvers.
 *
 * The `filter` comparator receives the row's data value (already passed
 * through `resolveDataValue` when one is defined) and the filter value
 * (already passed through `resolveFilterValue` by the table). Keeping
 * normalization in the resolvers means a variant of an existing filter
 * function only has to swap the resolvers, not re-implement the comparison.
 *
 * The definition is attached to the returned function, so a variant can be
 * created by spreading a built-in filter function and overriding what differs:
 *
 * ```ts
 * const normalize = (value: unknown) =>
 *   String(value ?? '')
 *     .toLowerCase()
 *     .normalize('NFD')
 *     .replace(/\p{Diacritic}/gu, '')
 *
 * const includesStringIgnoreDiacritics = constructFilterFn({
 *   ...filterFn_includesString,
 *   resolveFilterValue: normalize,
 *   resolveDataValue: normalize,
 * })
 * ```
 *
 * Note: the table applies `resolveFilterValue` once per filter before any rows
 * are tested. When calling a filter function directly (outside of a table),
 * apply it yourself: `fn(row, columnId, fn.resolveFilterValue?.(value) ?? value)`.
 */
export function constructFilterFn<
  TFeatures extends TableFeatures = any,
  TData extends RowData = any,
>(def: FilterFnDef<TFeatures, TData>): CreatedFilterFn<TFeatures, TData> {
  const filterFn: CreatedFilterFn<TFeatures, TData> = Object.assign(
    <TRowFeatures extends TableFeatures, TRowData extends RowData>(
      row: Row<TRowFeatures, TRowData>,
      columnId: string,
      filterValue: any,
      addMeta?: (meta: ExtractFilterMeta<TRowFeatures>) => void,
    ): boolean => {
      const rawValue = row.getValue(columnId)
      const dataValue = filterFn.resolveDataValue
        ? filterFn.resolveDataValue(rawValue)
        : rawValue
      // The def's comparator is typed against the factory's TFeatures/TData;
      // the caller's row generics are erased at this boundary.
      return filterFn.filter(
        dataValue,
        filterValue,
        row as any,
        columnId,
        addMeta as any,
      )
    },
    def,
  )
  return filterFn
}

// Basic filters

/**
 * Keeps rows whose column value is strictly equal to the filter value.
 *
 * Uses JavaScript `===` comparison and auto-removes empty filter values.
 */
export const filterFn_equals = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue === filterValue,
  autoRemove: (val: any) => testFalsy(val),
})

/**
 * Keeps rows whose column value is loosely equal to the filter value.
 *
 * Uses JavaScript `==` comparison and auto-removes empty filter values. This is
 * useful for matching string input against numeric row values.
 */
export const filterFn_weakEquals = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue == filterValue,
  autoRemove: (val: any) => testFalsy(val),
})

// String filters

/**
 * Keeps rows whose stringified column value includes the filter text.
 *
 * Matching is case-sensitive and empty filter values are auto-removed.
 */
export const filterFn_includesStringSensitive = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.includes(filterValue)),
  autoRemove: (val: any) => testFalsy(val),
  resolveFilterValue: (val: any) => String(val),
  resolveDataValue: (val: any) => (val == null ? undefined : String(val)),
})

/**
 * Keeps rows whose stringified column value includes the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
export const filterFn_includesString = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.includes(filterValue)),
  autoRemove: (val: any) => testFalsy(val),
  resolveFilterValue: (val: any) => String(val).toLowerCase(),
  resolveDataValue: (val: any) =>
    val == null ? undefined : String(val).toLowerCase(),
})

/**
 * Keeps rows whose stringified column value equals the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
export const filterFn_equalsString = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue === filterValue,
  autoRemove: (val: any) => testFalsy(val),
  resolveFilterValue: (val: any) => String(val).toLowerCase(),
  resolveDataValue: (val: any) =>
    val == null ? undefined : String(val).toLowerCase(),
})

/**
 * Keeps rows whose stringified column value exactly equals the filter text.
 *
 * Matching is case-sensitive and empty filter values are auto-removed.
 */
export const filterFn_equalsStringSensitive = constructFilterFn({
  filter: (dataValue, filterValue) => dataValue === filterValue,
  autoRemove: (val: any) => testFalsy(val),
  resolveFilterValue: (val: any) => String(val),
  resolveDataValue: (val: any) => (val == null ? undefined : String(val)),
})

/**
 * Keeps rows whose stringified column value starts with the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
export const filterFn_startsWith = constructFilterFn({
  filter: (dataValue, filterValue) =>
    Boolean(dataValue?.startsWith(filterValue)),
  autoRemove: (val: any) => testFalsy(val),
  resolveFilterValue: (val: any) => String(val).toLowerCase(),
  resolveDataValue: (val: any) =>
    val == null ? undefined : String(val).toLowerCase(),
})

/**
 * Keeps rows whose stringified column value ends with the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
export const filterFn_endsWith = constructFilterFn({
  filter: (dataValue, filterValue) => Boolean(dataValue?.endsWith(filterValue)),
  autoRemove: (val: any) => testFalsy(val),
  resolveFilterValue: (val: any) => String(val).toLowerCase(),
  resolveDataValue: (val: any) =>
    val == null ? undefined : String(val).toLowerCase(),
})

// Blank filters

/**
 * Keeps rows whose column value is empty.
 *
 * A value is empty when it is nullish or stringifies to whitespace only. The
 * filter value acts as an on/off flag: `false` and blank values are
 * auto-removed.
 */
export const filterFn_empty = constructFilterFn({
  filter: (dataValue) => testValueEmpty(dataValue),
  autoRemove: (val: any) => testFalsy(val) || val === false,
})

/**
 * Keeps rows whose column value is not empty.
 *
 * A value is empty when it is nullish or stringifies to whitespace only. The
 * filter value acts as an on/off flag: `false` and blank values are
 * auto-removed.
 */
export const filterFn_notEmpty = constructFilterFn({
  filter: (dataValue) => !testValueEmpty(dataValue),
  autoRemove: (val: any) => testFalsy(val) || val === false,
})

// Number filters

/**
 * Keeps rows whose value is greater than the filter value.
 *
 * Numeric values are compared numerically when both sides can be coerced to
 * numbers; otherwise normalized strings are compared.
 */
export const filterFn_greaterThan = constructFilterFn({
  filter: (dataValue, filterValue) =>
    compareGreaterThan(dataValue, filterValue),
  autoRemove: (val: any) => testFalsy(val),
})

/**
 * Keeps rows whose value is greater than or equal to the filter value.
 *
 * Delegates to the built-in greater-than and strict-equality comparisons.
 */
export const filterFn_greaterThanOrEqualTo = constructFilterFn({
  filter: (dataValue, filterValue) =>
    compareGreaterThanOrEqualTo(dataValue, filterValue),
  autoRemove: (val: any) => testFalsy(val),
})

/**
 * Keeps rows whose value is less than the filter value.
 *
 * This is implemented as the inverse of greater-than-or-equal comparison.
 */
export const filterFn_lessThan = constructFilterFn({
  filter: (dataValue, filterValue) =>
    !compareGreaterThanOrEqualTo(dataValue, filterValue),
  autoRemove: (val: any) => testFalsy(val),
})

/**
 * Keeps rows whose value is less than or equal to the filter value.
 *
 * This is implemented as the inverse of greater-than comparison.
 */
export const filterFn_lessThanOrEqualTo = constructFilterFn({
  filter: (dataValue, filterValue) =>
    !compareGreaterThan(dataValue, filterValue),
  autoRemove: (val: any) => testFalsy(val),
})

// Range filters

/**
 * Keeps rows whose value falls between an exclusive min/max pair.
 *
 * Blank range endpoints are treated as open-ended.
 */
export const filterFn_between = constructFilterFn({
  filter: (dataValue, filterValues: [unknown, unknown]) =>
    compareBetween(dataValue, filterValues, false),
  autoRemove: (val: any) =>
    testFalsy(val) ||
    (Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])),
})

/**
 * Keeps rows whose value falls between an inclusive min/max pair.
 *
 * Blank range endpoints are treated as open-ended.
 */
export const filterFn_betweenInclusive = constructFilterFn({
  filter: (dataValue, filterValues: [unknown, unknown]) =>
    compareBetween(dataValue, filterValues, true),
  autoRemove: (val: any) =>
    testFalsy(val) ||
    (Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])),
})

/**
 * Keeps rows whose numeric value is inside an inclusive `[min, max]` range.
 *
 * Filter values are normalized so blank endpoints become open-ended and
 * reversed endpoints are swapped.
 */
export const filterFn_inNumberRange = constructFilterFn({
  filter: (dataValue: number, filterValue: [number, number]) => {
    const [min, max] = filterValue
    return dataValue >= min && dataValue <= max
  },
  resolveFilterValue: (val: [any, any]) => {
    const [unsafeMin, unsafeMax] = val

    const parsedMin =
      typeof unsafeMin !== 'number' ? parseFloat(unsafeMin) : unsafeMin
    const parsedMax =
      typeof unsafeMax !== 'number' ? parseFloat(unsafeMax) : unsafeMax

    let min =
      unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin
    let max =
      unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax

    if (min > max) {
      const temp = min
      min = max
      max = temp
    }

    return [min, max] as const
  },
  autoRemove: (val: any) =>
    testFalsy(val) ||
    (Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])),
})

// Date filters

/**
 * Keeps rows whose date value is inside an inclusive `[min, max]` date range.
 *
 * Row values and range endpoints may be `Date` objects, timestamps, or
 * parseable date strings. Blank or invalid endpoints become open-ended and
 * reversed endpoints are swapped. Rows without a valid date never match.
 */
export const filterFn_inDateRange = constructFilterFn({
  filter: (dataValue: number, filterValue: [number, number]) => {
    const [min, max] = filterValue
    return dataValue >= min && dataValue <= max
  },
  resolveFilterValue: (val: [any, any]) => {
    const [unsafeMin, unsafeMax] = val

    const parsedMin = toDateTimestamp(unsafeMin)
    const parsedMax = toDateTimestamp(unsafeMax)

    let min = Number.isNaN(parsedMin) ? -Infinity : parsedMin
    let max = Number.isNaN(parsedMax) ? Infinity : parsedMax

    if (min > max) {
      const temp = min
      min = max
      max = temp
    }

    return [min, max] as const
  },
  resolveDataValue: (val: any) => toDateTimestamp(val),
  autoRemove: (val: any) =>
    testFalsy(val) ||
    (Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])),
})

// Array filters

/**
 * Keeps rows whose scalar column value equals at least one filter value.
 */
export const filterFn_arrHas = constructFilterFn({
  filter: (dataValue, filterValue: Array<unknown>) => {
    for (let i = 0; i < filterValue.length; i++) {
      if (dataValue === filterValue[i]) {
        return true
      }
    }
    return false
  },
  autoRemove: (val: any) => testFalsy(val) || !val?.length,
})

/**
 * Keeps rows whose array or string column value includes at least one filter value.
 */
export const filterFn_arrIncludes = constructFilterFn({
  filter: (dataValue, filterValue: Array<unknown>) => {
    if (typeof dataValue !== 'string' && !Array.isArray(dataValue)) {
      return false
    }

    for (let i = 0; i < filterValue.length; i++) {
      if (dataValue.includes(filterValue[i] as any)) {
        return true
      }
    }
    return false
  },
  autoRemove: (val: any) => testFalsy(val) || !val?.length,
})

/**
 * Keeps rows whose array column value includes every filter value.
 */
export const filterFn_arrIncludesAll = constructFilterFn({
  filter: (dataValue, filterValue: Array<unknown>) => {
    if (!Array.isArray(dataValue)) return false
    for (let i = 0; i < filterValue.length; i++) {
      if (!dataValue.includes(filterValue[i])) {
        return false
      }
    }
    return true
  },
  autoRemove: (val: any) => testFalsy(val) || !val?.length,
})

/**
 * Keeps rows whose array column value includes at least one filter value.
 */
export const filterFn_arrIncludesSome = constructFilterFn({
  filter: (dataValue, filterValue: Array<unknown>) => {
    if (!Array.isArray(dataValue)) return false
    for (let i = 0; i < filterValue.length; i++) {
      if (dataValue.includes(filterValue[i])) {
        return true
      }
    }
    return false
  },
  autoRemove: (val: any) => testFalsy(val) || !val?.length,
})

// Export

/**
 * The built-in filter function registry.
 *
 * Registering this full object opts out of tree-shaking: every built-in
 * filter function ends up in your bundle. Prefer importing the `filterFn_*`
 * functions you actually use and registering just those in the `filterFns`
 * slot, or passing them directly to the `filterFn` column option.
 *
 * @deprecated Import individual `filterFn_*` functions instead for a smaller
 * bundle. This export still works and is not going away in v9, but built-in
 * name resolution (including `filterFn: 'auto'`) only finds functions you
 * register yourself.
 */
export const filterFns = {
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrHas: filterFn_arrHas,
  arrIncludesSome: filterFn_arrIncludesSome,
  between: filterFn_between,
  betweenInclusive: filterFn_betweenInclusive,
  empty: filterFn_empty,
  endsWith: filterFn_endsWith,
  equals: filterFn_equals,
  equalsString: filterFn_equalsString,
  equalsStringSensitive: filterFn_equalsStringSensitive,
  inDateRange: filterFn_inDateRange,
  inNumberRange: filterFn_inNumberRange,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  notEmpty: filterFn_notEmpty,
  startsWith: filterFn_startsWith,
  weakEquals: filterFn_weakEquals,
}

export type BuiltInFilterFn = keyof typeof filterFns

// Utils

function testFalsy(val: any) {
  return val === undefined || val === null || val === ''
}

function testValueEmpty(dataValue: any) {
  return dataValue == null || String(dataValue).trim() === ''
}

function toDateTimestamp(value: any): number {
  if (value instanceof Date) {
    return value.getTime()
  }
  if (typeof value === 'number') {
    return value
  }
  // Guard nullish and blank values explicitly: `new Date(null)` is the epoch,
  // not an invalid date.
  if (value == null || value === '') {
    return NaN
  }
  return new Date(value).getTime()
}

function compareGreaterThan(dataValue: any, filterValue: any): boolean {
  const numericDataValue = dataValue == null ? 0 : +dataValue
  const numericFilterValue = Number(filterValue)

  if (!isNaN(numericFilterValue) && !isNaN(numericDataValue)) {
    return numericDataValue > numericFilterValue
  }

  const stringDataValue = String(dataValue ?? '')
    .toLowerCase()
    .trim()
  const stringFilterValue = String(filterValue).toLowerCase().trim()
  return stringDataValue > stringFilterValue
}

function compareGreaterThanOrEqualTo(dataValue: any, filterValue: any) {
  return dataValue === filterValue || compareGreaterThan(dataValue, filterValue)
}

function compareBetween(
  dataValue: any,
  filterValues: [unknown, unknown],
  inclusive: boolean,
): boolean {
  const min = filterValues[0]
  const hasMin = min !== '' && min !== undefined
  if (hasMin) {
    const passesMin = inclusive
      ? compareGreaterThanOrEqualTo(dataValue, min)
      : compareGreaterThan(dataValue, min)
    if (!passesMin) {
      return false
    }
  }

  const max = filterValues[1]
  if (max === '' || max === undefined) {
    return true
  }

  if (hasMin) {
    const numericMin = Number(min)
    const numericMax = Number(max)
    if (!isNaN(numericMin) && !isNaN(numericMax) && numericMin > numericMax) {
      return true
    }
  }

  return inclusive
    ? !compareGreaterThan(dataValue, max)
    : !compareGreaterThanOrEqualTo(dataValue, max)
}
