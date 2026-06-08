import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'

// Basic filters

/**
 * Keeps rows whose column value is strictly equal to the filter value.
 *
 * Uses JavaScript `===` comparison and auto-removes empty filter values.
 */
export const filterFn_equals = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return row.getValue(columnId) === filterValue
  },
  { autoRemove: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose column value is loosely equal to the filter value.
 *
 * Uses JavaScript `==` comparison and auto-removes empty filter values. This is
 * useful for matching string input against numeric row values.
 */
export const filterFn_weakEquals = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return row.getValue(columnId) == filterValue
  },
  { autoRemove: (val: any) => testFalsy(val) },
)

// String filters

/**
 * Keeps rows whose stringified column value includes the filter text.
 *
 * Matching is case-sensitive and empty filter values are auto-removed.
 */
export const filterFn_includesStringSensitive = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return Boolean(
      row.getValue(columnId)?.toString().includes(String(filterValue)),
    )
  },
  { autoRemove: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose stringified column value includes the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
export const filterFn_includesString = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return Boolean(
      row
        .getValue(columnId)
        ?.toString()
        .toLowerCase()
        .includes(String(filterValue).toLowerCase()),
    )
  },
  { autoRemove: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose stringified column value equals the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
export const filterFn_equalsString = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return (
      row.getValue(columnId)?.toString().toLowerCase() ===
      String(filterValue).toLowerCase()
    )
  },
  { autoRemove: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose stringified column value exactly equals the filter text.
 *
 * Matching is case-sensitive and empty filter values are auto-removed.
 */
export const filterFn_equalsStringSensitive = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return row.getValue(columnId)?.toString() === String(filterValue)
  },
  { autoRemove: (val: any) => testFalsy(val) },
)

// Number filters

/**
 * Keeps rows whose value is greater than the filter value.
 *
 * Numeric values are compared numerically when both sides can be coerced to
 * numbers; otherwise normalized strings are compared.
 */
export const filterFn_greaterThan = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    const rowValue = row.getValue(columnId)
    const numericRowValue =
      rowValue === null || rowValue === undefined ? 0 : +rowValue
    const numericFilterValue = Number(filterValue)

    if (!isNaN(numericFilterValue) && !isNaN(numericRowValue)) {
      return numericRowValue > numericFilterValue
    }

    const stringValue = (rowValue ?? '').toString().toLowerCase().trim()
    const stringFilterValue = String(filterValue).toLowerCase().trim()
    return stringValue > stringFilterValue
  },
  { resolveFilterValue: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose value is greater than or equal to the filter value.
 *
 * Delegates to the built-in greater-than and equality comparisons.
 */
export const filterFn_greaterThanOrEqualTo = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return (
      filterFn_greaterThan(row, columnId, filterValue) ||
      filterFn_equals(row, columnId, filterValue)
    )
  },
  { resolveFilterValue: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose value is less than the filter value.
 *
 * This is implemented as the inverse of greater-than-or-equal comparison.
 */
export const filterFn_lessThan = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return !filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
  },
  { resolveFilterValue: (val: any) => testFalsy(val) },
)

/**
 * Keeps rows whose value is less than or equal to the filter value.
 *
 * This is implemented as the inverse of greater-than comparison.
 */
export const filterFn_lessThanOrEqualTo = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: unknown,
  ) => {
    return !filterFn_greaterThan(row, columnId, filterValue)
  },
  { resolveFilterValue: (val: any) => testFalsy(val) },
)

// Range filters

/**
 * Keeps rows whose value falls between an exclusive min/max pair.
 *
 * Blank range endpoints are treated as open-ended.
 */
const filterFn_between = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValues: [unknown, unknown],
  ): boolean =>
    ((['', undefined] as Array<any>).includes(filterValues[0]) ||
      filterFn_greaterThan(row, columnId, filterValues[0])) &&
    ((!isNaN(Number(filterValues[0])) &&
      !isNaN(Number(filterValues[1])) &&
      Number(filterValues[0]) > Number(filterValues[1])) ||
      (['', undefined] as Array<any>).includes(filterValues[1]) ||
      filterFn_lessThan(row, columnId, filterValues[1])),
  { autoRemove: (val: any) => !val },
)

/**
 * Keeps rows whose value falls between an inclusive min/max pair.
 *
 * Blank range endpoints are treated as open-ended.
 */
const filterFn_betweenInclusive = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValues: [unknown, unknown],
  ): boolean =>
    ((['', undefined] as Array<any>).includes(filterValues[0]) ||
      filterFn_greaterThanOrEqualTo(row, columnId, filterValues[0])) &&
    ((!isNaN(Number(filterValues[0])) &&
      !isNaN(Number(filterValues[1])) &&
      Number(filterValues[0]) > Number(filterValues[1])) ||
      (['', undefined] as Array<any>).includes(filterValues[1]) ||
      filterFn_lessThanOrEqualTo(row, columnId, filterValues[1])),
  { autoRemove: (val: any) => !val },
)

/**
 * Keeps rows whose numeric value is inside an inclusive `[min, max]` range.
 *
 * Filter values are normalized so blank endpoints become open-ended and
 * reversed endpoints are swapped.
 */
export const filterFn_inNumberRange = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: [number, number],
  ) => {
    const [min, max] = filterValue

    const rowValue: number = row.getValue(columnId)
    return rowValue >= min && rowValue <= max
  },
  {
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
      testFalsy(val) || (testFalsy(val[0]) && testFalsy(val[1])),
  },
)

// Array filters

/**
 * Keeps rows whose scalar column value equals at least one filter value.
 */
export const filterFn_arrHas = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: Array<unknown>,
) => {
  return filterValue.some((val) => row.getValue<unknown>(columnId) === val)
}

/**
 * Keeps rows whose array or string column value includes at least one filter value.
 */
export const filterFn_arrIncludes = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: Array<unknown>,
  ) => {
    return filterValue.some((val) =>
      (row.getValue<unknown>(columnId) as Array<unknown> | string).includes(
        val as any,
      ),
    )
  },
  { autoRemove: (val: any) => testFalsy(val) || !val?.length },
)

/**
 * Keeps rows whose array column value includes every filter value.
 */
export const filterFn_arrIncludesAll = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: Array<unknown>,
  ) => {
    const value = row.getValue<Array<unknown>>(columnId)
    if (!Array.isArray(value)) return false
    return !filterValue.some((val) => !value.includes(val))
  },
  { autoRemove: (val: any) => testFalsy(val) || !val?.length },
)

/**
 * Keeps rows whose array column value includes at least one filter value.
 */
export const filterFn_arrIncludesSome = Object.assign(
  <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: Array<unknown>,
  ) => {
    const value = row.getValue<Array<unknown>>(columnId)
    if (!Array.isArray(value)) return false
    return filterValue.some((val) => value.includes(val))
  },
  { autoRemove: (val: any) => testFalsy(val) || !val?.length },
)

// Export

/**
 * The built-in filter function registry.
 *
 * Pass this object to filtered row model creation or extend it with custom filter functions.
 */
export const filterFns = {
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrHas: filterFn_arrHas,
  arrIncludesSome: filterFn_arrIncludesSome,
  between: filterFn_between,
  betweenInclusive: filterFn_betweenInclusive,
  equals: filterFn_equals,
  equalsString: filterFn_equalsString,
  inNumberRange: filterFn_inNumberRange,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  weakEquals: filterFn_weakEquals,
}

export type BuiltInFilterFn = keyof typeof filterFns

// Utils

function testFalsy(val: any) {
  return val === undefined || val === null || val === ''
}
