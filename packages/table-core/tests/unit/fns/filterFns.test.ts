import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructFilterFn,
  constructTable,
  createFilteredRowModel,
  filterFn_empty,
  filterFn_endsWith,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_equalsStringSensitive,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_lessThan,
  filterFn_lessThanOrEqualTo,
  filterFn_notEmpty,
  filterFn_startsWith,
  filterFn_weakEquals,
  filterFns,
} from '../../../src'
import { testFeatures } from '../../fixtures/features'
import { generateTestColumnDefs } from '../../fixtures/data/generateTestColumnDefs'
import { getStaticTestData } from '../../fixtures/data/generateTestData'
import type { ColumnDef } from '../../../src'

const features = testFeatures({
  columnFilteringFeature,
})

const data = getStaticTestData()
const table = constructTable({
  features,
  data,
  columns: generateTestColumnDefs<typeof features>(data),
})
const mockRows = table.getRowModel().rows

describe('Filter Functions', () => {
  describe('Basic Filters', () => {
    describe('filterFn_equals', () => {
      it('should match exact values', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'John'
        const result = filterFn_equals(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match values with type coercion (e.g., "1" == 1)', () => {
        const row = mockRows[0]!
        const columnId = 'id'
        const filterValue = 1 // number instead of string
        const result = filterFn_equals(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should handle null/undefined values', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = null
        const result = filterFn_equals(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should correctly identify non-matches', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'Jane'
        const result = filterFn_equals(row, columnId, filterValue)
        expect(result).toBe(false)
      })
    })

    describe('filterFn_weakEquals', () => {
      it('should match exact values', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'John'
        const result = filterFn_weakEquals(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match values with type coercion (e.g., "1" == 1)', () => {
        const row = mockRows[0]!
        const columnId = 'id'
        const filterValue = 1 // number instead of string
        const result = filterFn_weakEquals(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should handle null/undefined values', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = null
        const result = filterFn_weakEquals(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should correctly identify non-matches', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'Jane'
        const result = filterFn_weakEquals(row, columnId, filterValue)
        expect(result).toBe(false)
      })
    })
  })

  describe('String Filters', () => {
    describe('filterFn_includesStringSensitive', () => {
      it('should match case-sensitive substrings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'John'
        const result = filterFn_includesStringSensitive(
          row,
          columnId,
          filterValue,
        )
        expect(result).toBe(true)
      })
      it('should not match different case substrings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'john' // lowercase
        const result = filterFn_includesStringSensitive(
          row,
          columnId,
          filterValue,
        )
        expect(result).toBe(false)
      })
      it('should handle partial matches', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'ohn'
        const result = filterFn_includesStringSensitive(
          row,
          columnId,
          filterValue,
        )
        expect(result).toBe(true)
      })
      it('should stringify resolved filter values for row-model filtering', () => {
        expect(filterFn_includesStringSensitive.resolveFilterValue?.(123)).toBe(
          '123',
        )
        expect(
          filterFn_includesStringSensitive.resolveFilterValue?.('John'),
        ).toBe('John')
      })
    })

    describe('filterFn_includesString', () => {
      // The table applies `resolveFilterValue` once per filter before rows are
      // tested; direct calls mirror that contract here.
      const resolveFilterValue = filterFn_includesString.resolveFilterValue!

      it('should match case-insensitive substrings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = resolveFilterValue('John')
        const result = filterFn_includesString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match different case substrings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = resolveFilterValue('jOhN')
        const result = filterFn_includesString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should handle partial matches', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = resolveFilterValue('OHN')
        const result = filterFn_includesString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should normalize resolved filter values for row-model filtering', () => {
        expect(filterFn_includesString.resolveFilterValue?.('JoH')).toBe('joh')
        expect(filterFn_includesString.resolveFilterValue?.(123)).toBe('123')
      })
    })

    describe('filterFn_equalsString', () => {
      // The table applies `resolveFilterValue` once per filter before rows are
      // tested; direct calls mirror that contract here.
      const resolveFilterValue = filterFn_equalsString.resolveFilterValue!

      it('should match exact strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = resolveFilterValue('John')
        const result = filterFn_equalsString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match case-insensitive exact strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = resolveFilterValue('jOhN')
        const result = filterFn_equalsString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match partial strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = resolveFilterValue('ohn')
        const result = filterFn_equalsString(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should normalize resolved filter values for row-model filtering', () => {
        expect(filterFn_equalsString.resolveFilterValue?.('JoHn')).toBe('john')
        expect(filterFn_equalsString.resolveFilterValue?.(123)).toBe('123')
      })
    })

    describe('filterFn_equalsStringSensitive', () => {
      it('should match case-sensitive exact strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'John'
        const result = filterFn_equalsStringSensitive(
          row,
          columnId,
          filterValue,
        )
        expect(result).toBe(true)
      })
      it('should not match case-insensitive exact strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'john'
        const result = filterFn_equalsStringSensitive(
          row,
          columnId,
          filterValue,
        )
        expect(result).toBe(false)
      })
      it('should not match partial strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'ohn'
        const result = filterFn_equalsStringSensitive(
          row,
          columnId,
          filterValue,
        )
        expect(result).toBe(false)
      })
      it('should stringify resolved filter values for row-model filtering', () => {
        expect(filterFn_equalsStringSensitive.resolveFilterValue?.(123)).toBe(
          '123',
        )
        expect(
          filterFn_equalsStringSensitive.resolveFilterValue?.('John'),
        ).toBe('John')
      })
    })
  })

  describe('Number Filters', () => {
    describe('numeric comparison filter metadata', () => {
      const comparisonFns = [
        filterFn_greaterThan,
        filterFn_greaterThanOrEqualTo,
        filterFn_lessThan,
        filterFn_lessThanOrEqualTo,
      ]

      it('does not transform filter values during row-model filtering', () => {
        for (const filterFn of comparisonFns) {
          expect(
            (filterFn as { resolveFilterValue?: unknown }).resolveFilterValue,
          ).toBeUndefined()
        }
      })

      it('auto-removes only empty comparison filter values', () => {
        for (const filterFn of comparisonFns) {
          expect(filterFn.autoRemove?.(30)).toBe(false)
          expect(filterFn.autoRemove?.('30')).toBe(false)
          expect(filterFn.autoRemove?.(0)).toBe(false)
          expect(filterFn.autoRemove?.(null)).toBe(true)
          expect(filterFn.autoRemove?.(undefined)).toBe(true)
          expect(filterFn.autoRemove?.('')).toBe(true)
        }
      })
    })

    describe('filterFn_greaterThan', () => {
      it('should match greater than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 29
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match equal values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 30
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should not match less than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 31
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings greater than numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '29'
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings less than numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '31'
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings greater than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'a'
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings less than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'z'
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should not match strings equal to other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'John'
        const result = filterFn_greaterThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
    })
    describe('filterFn_greaterThanOrEqualTo', () => {
      it('should match greater than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 29
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match equal values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 30
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match less than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 31
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings greater than to numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '29'
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings less than numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '31'
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings greater than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'a'
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings less than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'z'
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings equal to other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'John'
        const result = filterFn_greaterThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
    })
    describe('filterFn_lessThan', () => {
      it('should match less than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 31
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match equal values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 30
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should not match greater than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 29
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings less than numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '31'
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match strings less than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'z'
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings equal to other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'John'
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should not match strings greater than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'a'
        const result = filterFn_lessThan(row, columnId, filterValue)
        expect(result).toBe(false)
      })
    })
    describe('filterFn_lessThanOrEqualTo', () => {
      it('should match less than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 31
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match equal values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 30
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match greater than values', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = 29
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings less than to numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '31'
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings greater than numbers', () => {
        const row = mockRows[0]!
        const columnId = 'age' // number value 30
        const filterValue = '29'
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings less than to other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'z'
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match strings greater than other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'a'
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(false)
      })
      it('should match strings equal to other strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName' // 'John'
        const filterValue = 'John'
        const result = filterFn_lessThanOrEqualTo(row, columnId, filterValue)
        expect(result).toBe(true)
      })
    })
  })

  describe('Range Filters', () => {
    describe('filterFns.between', () => {
      const between = filterFns.between

      it('matches values strictly between both endpoints', () => {
        const row = mockRows[0]!

        expect(between(row, 'age', [29, 31])).toBe(true)
        expect(between(row, 'age', [30, 31])).toBe(false)
        expect(between(row, 'age', [29, 30])).toBe(false)
      })

      it('treats blank endpoints as open-ended', () => {
        const row = mockRows[0]!

        expect(between(row, 'age', [undefined, 31])).toBe(true)
        expect(between(row, 'age', ['', 31])).toBe(true)
        expect(between(row, 'age', [29, undefined])).toBe(true)
        expect(between(row, 'age', [29, ''])).toBe(true)
      })

      it('enforces a negative max when the min endpoint is blank', () => {
        const row = mockRows[0]!

        expect(between(row, 'age', [undefined, -1])).toBe(false)
        expect(between(row, 'age', ['', -1])).toBe(false)
      })

      it('preserves reversed-range behavior after the lower bound passes', () => {
        const row = mockRows[0]!

        expect(between(row, 'age', [29, 20])).toBe(true)
        expect(between(row, 'age', [31, 20])).toBe(false)
      })
    })

    describe('filterFns.betweenInclusive', () => {
      const betweenInclusive = filterFns.betweenInclusive

      it('matches values inclusively between both endpoints', () => {
        const row = mockRows[0]!

        expect(betweenInclusive(row, 'age', [29, 31])).toBe(true)
        expect(betweenInclusive(row, 'age', [30, 31])).toBe(true)
        expect(betweenInclusive(row, 'age', [29, 30])).toBe(true)
        expect(betweenInclusive(row, 'age', [31, 40])).toBe(false)
      })

      it('treats blank endpoints as open-ended', () => {
        const row = mockRows[0]!

        expect(betweenInclusive(row, 'age', [undefined, 30])).toBe(true)
        expect(betweenInclusive(row, 'age', ['', 30])).toBe(true)
        expect(betweenInclusive(row, 'age', [30, undefined])).toBe(true)
        expect(betweenInclusive(row, 'age', [30, ''])).toBe(true)
      })

      it('enforces a negative max when the min endpoint is blank', () => {
        const row = mockRows[0]!

        expect(betweenInclusive(row, 'age', [undefined, -1])).toBe(false)
        expect(betweenInclusive(row, 'age', ['', -1])).toBe(false)
      })

      it('preserves reversed-range behavior after the lower bound passes', () => {
        const row = mockRows[0]!

        expect(betweenInclusive(row, 'age', [30, 20])).toBe(true)
        expect(betweenInclusive(row, 'age', [31, 20])).toBe(false)
      })
    })

    describe('filterFns.between.autoRemove', () => {
      const autoRemove = filterFns.between.autoRemove!

      it('should auto-remove when both endpoints are undefined', () => {
        expect(autoRemove([undefined, undefined])).toBe(true)
      })
      it('should auto-remove when both endpoints are null', () => {
        expect(autoRemove([null, null])).toBe(true)
      })
      it('should auto-remove when both endpoints are empty strings', () => {
        expect(autoRemove(['', ''])).toBe(true)
      })
      it('should NOT auto-remove when both endpoints are valid numbers', () => {
        expect(autoRemove([5, 10])).toBe(false)
      })
      it('should NOT auto-remove when lower bound is 0 (falsy number)', () => {
        expect(autoRemove([0, 10])).toBe(false)
      })
      it('should NOT auto-remove when only one endpoint is provided', () => {
        expect(autoRemove([undefined, 10])).toBe(false)
        expect(autoRemove([5, undefined])).toBe(false)
      })
      it('should NOT auto-remove a scalar value passed instead of a range tuple', () => {
        // Regression test for #6353 - without the Array.isArray guard,
        // `val[0]` and `val[1]` are undefined for a scalar and the index
        // checks incorrectly auto-remove the filter.
        expect(autoRemove(99 as any)).toBe(false)
      })
    })

    describe('filterFns.betweenInclusive.autoRemove', () => {
      const autoRemove = filterFns.betweenInclusive.autoRemove!

      it('should auto-remove when both endpoints are undefined', () => {
        expect(autoRemove([undefined, undefined])).toBe(true)
      })
      it('should auto-remove when both endpoints are null', () => {
        expect(autoRemove([null, null])).toBe(true)
      })
      it('should auto-remove when both endpoints are empty strings', () => {
        expect(autoRemove(['', ''])).toBe(true)
      })
      it('should NOT auto-remove when both endpoints are valid numbers', () => {
        expect(autoRemove([5, 10])).toBe(false)
      })
      it('should NOT auto-remove when lower bound is 0 (falsy number)', () => {
        expect(autoRemove([0, 10])).toBe(false)
      })
      it('should NOT auto-remove when only one endpoint is provided', () => {
        expect(autoRemove([undefined, 10])).toBe(false)
        expect(autoRemove([5, undefined])).toBe(false)
      })
      it('should NOT auto-remove a scalar value passed instead of a range tuple', () => {
        // Regression test for #6353 - same Array.isArray guard needed
        // here as in `between` and `inNumberRange`.
        expect(autoRemove(99 as any)).toBe(false)
      })
    })

    describe('filterFns.inNumberRange.autoRemove', () => {
      const autoRemove = filterFns.inNumberRange.autoRemove!

      it('should auto-remove when both endpoints are undefined', () => {
        expect(autoRemove([undefined, undefined])).toBe(true)
      })
      it('should auto-remove when both endpoints are null', () => {
        expect(autoRemove([null, null])).toBe(true)
      })
      it('should auto-remove when both endpoints are empty strings', () => {
        expect(autoRemove(['', ''])).toBe(true)
      })
      it('should NOT auto-remove when both endpoints are valid numbers', () => {
        expect(autoRemove([5, 10])).toBe(false)
      })
      it('should NOT auto-remove when lower bound is 0 (falsy number)', () => {
        expect(autoRemove([0, 10])).toBe(false)
      })
      it('should NOT auto-remove when only one endpoint is provided', () => {
        expect(autoRemove([undefined, 10])).toBe(false)
        expect(autoRemove([5, undefined])).toBe(false)
      })
      it('should NOT auto-remove a non-empty scalar number passed instead of a range tuple', () => {
        // Regression test for #6353 - `val[0]` and `val[1]` were both
        // undefined for a non-array scalar, so the previous index checks
        // produced true && true and the filter was discarded.
        expect(autoRemove(99 as any)).toBe(false)
        expect(autoRemove(0 as any)).toBe(false)
      })
      it('should auto-remove an empty-string scalar (matches existing testFalsy behavior)', () => {
        // `testFalsy` treats '' as falsy, and the leading `testFalsy(val)`
        // branch short-circuits to true for an empty string. The new
        // Array.isArray guard is intentionally additive and only kicks in
        // when the value is not already caught by `testFalsy`.
        expect(autoRemove('' as any)).toBe(true)
      })
    })

    describe('filterFn_inNumberRange', () => {
      // Mirror the real filtering pipeline: the raw `[min, max]` the user
      // sets is run through `resolveFilterValue` before the filter fn sees it
      const resolve = (val: [any, any]) =>
        filterFn_inNumberRange.resolveFilterValue!(val)
      const makeRow = (value: unknown) => ({ getValue: () => value }) as any

      it('should match numbers inside the range and on the inclusive boundaries', () => {
        expect(
          filterFn_inNumberRange(makeRow(15), 'age', resolve([0, 20])),
        ).toBe(true)
        expect(
          filterFn_inNumberRange(makeRow(0), 'age', resolve([0, 20])),
        ).toBe(true)
        expect(
          filterFn_inNumberRange(makeRow(20), 'age', resolve([0, 20])),
        ).toBe(true)
      })

      it('should not match numbers outside the range', () => {
        expect(
          filterFn_inNumberRange(makeRow(25), 'age', resolve([0, 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow(-5), 'age', resolve([0, 20])),
        ).toBe(false)
      })

      it('should not match nullish or blank values in a zero-spanning range', () => {
        // `null >= 0 && null <= 20` coerces to true in JS, so nullable
        // numeric columns used to leak empty rows into a [0, max] range
        expect(
          filterFn_inNumberRange(makeRow(null), 'age', resolve([0, 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow(undefined), 'age', resolve([0, 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow(''), 'age', resolve([0, 20])),
        ).toBe(false)
      })

      it('should not match booleans, numeric strings, or NaN', () => {
        expect(
          filterFn_inNumberRange(makeRow(true), 'age', resolve([0, 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow(false), 'age', resolve([0, 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow('15'), 'age', resolve([0, 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow(NaN), 'age', resolve([0, 20])),
        ).toBe(false)
      })

      it('should keep matching real numbers in open-ended ranges while excluding empty values', () => {
        expect(
          filterFn_inNumberRange(makeRow(-5), 'age', resolve(['', 20])),
        ).toBe(true)
        expect(
          filterFn_inNumberRange(makeRow(null), 'age', resolve(['', 20])),
        ).toBe(false)
        expect(
          filterFn_inNumberRange(makeRow(500), 'age', resolve([0, ''])),
        ).toBe(true)
      })
    })
  })

  describe('Array Filters', () => {
    type Sample = { value: unknown }

    const sampleColumns: Array<ColumnDef<typeof features, Sample, any>> = [
      { accessorKey: 'value', id: 'value' },
    ]

    function makeRow(value: unknown) {
      const sampleTable = constructTable<typeof features, Sample>({
        features,
        data: [{ value }],
        columns: sampleColumns,
      })
      const row = sampleTable.getRowModel().rows[0]!
      const getValueSpy = vi.spyOn(row, 'getValue')
      return { row, getValueCalls: () => getValueSpy.mock.calls.length }
    }

    describe('filterFns.arrHas', () => {
      const arrHas = filterFns.arrHas

      it('matches scalar values against any filter value', () => {
        const { row, getValueCalls } = makeRow('b')

        expect(arrHas(row, 'value', ['a', 'b'])).toBe(true)
        expect(getValueCalls()).toBe(1)
      })

      it('does not match when no filter value equals the scalar value', () => {
        const { row } = makeRow('c')

        expect(arrHas(row, 'value', ['a', 'b'])).toBe(false)
      })
    })

    describe('filterFns.arrIncludes', () => {
      const arrIncludes = filterFns.arrIncludes

      it('matches array values that include any filter value', () => {
        const { row, getValueCalls } = makeRow(['a', 'b'])

        expect(arrIncludes(row, 'value', ['z', 'b'])).toBe(true)
        expect(getValueCalls()).toBe(1)
      })

      it('matches string values that include any filter value', () => {
        const { row } = makeRow('hello')

        expect(arrIncludes(row, 'value', ['zz', 'ell'])).toBe(true)
      })

      it('does not match when no filter value is included', () => {
        const { row } = makeRow(['a', 'b'])

        expect(arrIncludes(row, 'value', ['x', 'y'])).toBe(false)
      })

      it('does not throw or match for nullish row values', () => {
        expect(arrIncludes(makeRow(null).row, 'value', ['a'])).toBe(false)
        expect(arrIncludes(makeRow(undefined).row, 'value', ['a'])).toBe(false)
      })
    })

    describe('filterFns.arrIncludesAll', () => {
      const arrIncludesAll = filterFns.arrIncludesAll

      it('matches array values that include every filter value', () => {
        const { row } = makeRow(['a', 'b', 'c'])

        expect(arrIncludesAll(row, 'value', ['a', 'c'])).toBe(true)
      })

      it('does not match when any filter value is missing', () => {
        const { row } = makeRow(['a', 'b'])

        expect(arrIncludesAll(row, 'value', ['a', 'c'])).toBe(false)
      })

      it('does not match non-array row values', () => {
        const { row } = makeRow('abc')

        expect(arrIncludesAll(row, 'value', ['a'])).toBe(false)
      })
    })

    describe('filterFns.arrIncludesSome', () => {
      const arrIncludesSome = filterFns.arrIncludesSome

      it('matches array values that include at least one filter value', () => {
        const { row } = makeRow(['a', 'b'])

        expect(arrIncludesSome(row, 'value', ['z', 'b'])).toBe(true)
      })

      it('does not match when no filter value is included', () => {
        const { row } = makeRow(['a', 'b'])

        expect(arrIncludesSome(row, 'value', ['x', 'y'])).toBe(false)
      })

      it('does not match non-array row values', () => {
        const { row } = makeRow('abc')

        expect(arrIncludesSome(row, 'value', ['a'])).toBe(false)
      })
    })

    describe('filterFns.arrHas.autoRemove', () => {
      const autoRemove = filterFns.arrHas.autoRemove!

      it('should auto-remove when the filter value is undefined', () => {
        expect(autoRemove(undefined)).toBe(true)
      })
      it('should auto-remove when the filter value is null', () => {
        expect(autoRemove(null)).toBe(true)
      })
      it('should auto-remove when the filter value is an empty string', () => {
        expect(autoRemove('')).toBe(true)
      })
      it('should auto-remove when the filter value is an empty array', () => {
        expect(autoRemove([])).toBe(true)
      })
      it('should NOT auto-remove when the filter value is a non-empty array', () => {
        expect(autoRemove(['a'])).toBe(false)
      })
    })
  })
})

describe('Number Range Filters', () => {
  describe('filterFn_inNumberRange', () => {
    it('should match values inclusively within the range', () => {
      const row = mockRows[0]! // age 30

      expect(filterFn_inNumberRange(row, 'age', [29, 31])).toBe(true)
      expect(filterFn_inNumberRange(row, 'age', [30, 30])).toBe(true)
      expect(filterFn_inNumberRange(row, 'age', [31, 40])).toBe(false)
      expect(filterFn_inNumberRange(row, 'age', [10, 29])).toBe(false)
    })

    it('should coerce string endpoints in resolveFilterValue', () => {
      expect(filterFn_inNumberRange.resolveFilterValue!(['29', '31'])).toEqual([
        29, 31,
      ])
    })

    it('should treat null and non-numeric endpoints as open-ended', () => {
      expect(filterFn_inNumberRange.resolveFilterValue!([null, 31])).toEqual([
        -Infinity,
        31,
      ])
      expect(filterFn_inNumberRange.resolveFilterValue!([29, 'abc'])).toEqual([
        29,
        Infinity,
      ])
    })

    it('should swap reversed ranges', () => {
      expect(filterFn_inNumberRange.resolveFilterValue!([31, 29])).toEqual([
        29, 31,
      ])
    })

    it('should auto-remove only fully empty ranges', () => {
      const autoRemove = filterFn_inNumberRange.autoRemove!

      expect(autoRemove(undefined)).toBe(true)
      expect(autoRemove([null, null])).toBe(true)
      expect(autoRemove(['', ''])).toBe(true)
      expect(autoRemove([5, undefined])).toBe(false)
      expect(autoRemove([undefined, 10])).toBe(false)
      expect(autoRemove([0, 10])).toBe(false)
    })
  })
})

describe('constructFilterFn', () => {
  const normalize = (val: any) =>
    String(val ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')

  // A variant of a built-in filter fn: same comparator and autoRemove, only
  // the resolvers change.
  const includesStringIgnoreDiacritics = constructFilterFn({
    ...filterFn_includesString,
    resolveFilterValue: normalize,
    resolveDataValue: normalize,
  })

  type Sample = { name: string | null }
  const sampleColumns: Array<ColumnDef<typeof features, Sample, any>> = [
    { accessorKey: 'name', id: 'name' },
  ]

  function makeRow(name: string | null) {
    const sampleTable = constructTable<typeof features, Sample>({
      features,
      data: [{ name }],
      columns: sampleColumns,
    })
    return sampleTable.getRowModel().rows[0]!
  }

  it('matches data with diacritics against plain filter text', () => {
    const row = makeRow('Éric Bernard')
    const filterValue =
      includesStringIgnoreDiacritics.resolveFilterValue!('eric')

    expect(includesStringIgnoreDiacritics(row, 'name', filterValue)).toBe(true)
    // The base filter fn does not match across diacritics
    expect(
      filterFn_includesString(
        row,
        'name',
        filterFn_includesString.resolveFilterValue!('eric'),
      ),
    ).toBe(false)
  })

  it('matches filter text with diacritics against plain data', () => {
    const row = makeRow('Zoe Smith')
    const filterValue =
      includesStringIgnoreDiacritics.resolveFilterValue!('Zoë')

    expect(includesStringIgnoreDiacritics(row, 'name', filterValue)).toBe(true)
  })

  it('inherits the base autoRemove behavior through the spread', () => {
    expect(includesStringIgnoreDiacritics.autoRemove!('')).toBe(true)
    expect(includesStringIgnoreDiacritics.autoRemove!('x')).toBe(false)
  })

  it('honors resolveDataValue assigned after creation', () => {
    const upperCaseEquals = constructFilterFn({
      ...filterFn_equalsStringSensitive,
    })
    upperCaseEquals.resolveDataValue = (val: any) => String(val).toUpperCase()

    expect(upperCaseEquals(makeRow('john'), 'name', 'JOHN')).toBe(true)
  })

  it('applies both resolvers when filtering through the table row model', () => {
    const filteringFeatures = testFeatures({
      columnFilteringFeature,
      filteredRowModel: createFilteredRowModel(),
    })
    const filteredTable = constructTable<typeof filteringFeatures, Sample>({
      features: filteringFeatures,
      data: [
        { name: 'Enrico Toccacelo' },
        { name: 'Éric Bernard' },
        { name: 'Eric Brandon' },
        { name: null },
      ],
      columns: [
        {
          accessorKey: 'name',
          id: 'name',
          filterFn: includesStringIgnoreDiacritics,
        },
      ],
      initialState: {
        columnFilters: [{ id: 'name', value: 'ERIC' }],
      },
    })

    expect(
      filteredTable.getFilteredRowModel().rows.map((row) => row.original.name),
    ).toEqual(['Éric Bernard', 'Eric Brandon'])
  })
})

describe('filterFn_startsWith / filterFn_endsWith', () => {
  it('matches prefixes case-insensitively', () => {
    const row = mockRows[0]! // firstName 'John'
    const resolve = filterFn_startsWith.resolveFilterValue!

    expect(filterFn_startsWith(row, 'firstName', resolve('JO'))).toBe(true)
    expect(filterFn_startsWith(row, 'firstName', resolve('ohn'))).toBe(false)
  })

  it('matches suffixes case-insensitively', () => {
    const row = mockRows[0]! // firstName 'John'
    const resolve = filterFn_endsWith.resolveFilterValue!

    expect(filterFn_endsWith(row, 'firstName', resolve('HN'))).toBe(true)
    expect(filterFn_endsWith(row, 'firstName', resolve('Jo'))).toBe(false)
  })

  it('auto-removes empty filter values', () => {
    expect(filterFn_startsWith.autoRemove!('')).toBe(true)
    expect(filterFn_endsWith.autoRemove!(undefined)).toBe(true)
    expect(filterFn_startsWith.autoRemove!('j')).toBe(false)
  })
})

describe('filterFn_empty / filterFn_notEmpty', () => {
  function makeValueRow(value: unknown) {
    const sampleTable = constructTable<typeof features, { value: unknown }>({
      features,
      data: [{ value }],
      columns: [{ accessorKey: 'value', id: 'value' }],
    })
    return sampleTable.getRowModel().rows[0]!
  }

  it('treats nullish and whitespace-only values as empty', () => {
    expect(filterFn_empty(makeValueRow(null), 'value', true)).toBe(true)
    expect(filterFn_empty(makeValueRow(undefined), 'value', true)).toBe(true)
    expect(filterFn_empty(makeValueRow(''), 'value', true)).toBe(true)
    expect(filterFn_empty(makeValueRow('   '), 'value', true)).toBe(true)
    expect(filterFn_empty(makeValueRow([]), 'value', true)).toBe(true)
  })

  it('treats real values as not empty, including falsy ones', () => {
    expect(filterFn_empty(makeValueRow('x'), 'value', true)).toBe(false)
    expect(filterFn_empty(makeValueRow(0), 'value', true)).toBe(false)
    expect(filterFn_empty(makeValueRow(false), 'value', true)).toBe(false)
  })

  it('mirrors empty with notEmpty', () => {
    expect(filterFn_notEmpty(makeValueRow(null), 'value', true)).toBe(false)
    expect(filterFn_notEmpty(makeValueRow('x'), 'value', true)).toBe(true)
  })

  it('auto-removes only when the flag is turned off or blank', () => {
    for (const filterFn of [filterFn_empty, filterFn_notEmpty]) {
      expect(filterFn.autoRemove!(false)).toBe(true)
      expect(filterFn.autoRemove!(undefined)).toBe(true)
      expect(filterFn.autoRemove!('')).toBe(true)
      expect(filterFn.autoRemove!(true)).toBe(false)
    }
  })
})

describe('filterFn_inDateRange', () => {
  const resolve = filterFn_inDateRange.resolveFilterValue!

  function makeValueRow(value: unknown) {
    const sampleTable = constructTable<typeof features, { value: unknown }>({
      features,
      data: [{ value }],
      columns: [{ accessorKey: 'value', id: 'value' }],
    })
    return sampleTable.getRowModel().rows[0]!
  }

  it('coerces Date, string, and timestamp endpoints to timestamps', () => {
    const min = new Date('2026-01-01')
    const max = new Date('2026-01-31')

    expect(resolve([min, max])).toEqual([min.getTime(), max.getTime()])
    expect(resolve(['2026-01-01', max.getTime()])).toEqual([
      min.getTime(),
      max.getTime(),
    ])
  })

  it('treats blank or invalid endpoints as open-ended and swaps reversed ranges', () => {
    const min = new Date('2026-01-01')

    expect(resolve([null, null])).toEqual([-Infinity, Infinity])
    expect(resolve([min, ''])).toEqual([min.getTime(), Infinity])
    expect(resolve(['not a date', min])).toEqual([-Infinity, min.getTime()])
    expect(resolve([new Date('2026-01-31'), min])).toEqual([
      min.getTime(),
      new Date('2026-01-31').getTime(),
    ])
  })

  it('matches Date, string, and timestamp row values inside the range', () => {
    const range = resolve([new Date('2026-01-05'), new Date('2026-01-15')])

    expect(
      filterFn_inDateRange(
        makeValueRow(new Date('2026-01-10')),
        'value',
        range,
      ),
    ).toBe(true)
    expect(
      filterFn_inDateRange(makeValueRow('2026-01-10'), 'value', range),
    ).toBe(true)
    expect(
      filterFn_inDateRange(
        makeValueRow(new Date('2026-01-10').getTime()),
        'value',
        range,
      ),
    ).toBe(true)
    expect(
      filterFn_inDateRange(
        makeValueRow(new Date('2026-01-20')),
        'value',
        range,
      ),
    ).toBe(false)
  })

  it('never matches rows without a valid date', () => {
    const range = resolve([null, null]) // fully open range

    expect(filterFn_inDateRange(makeValueRow(null), 'value', range)).toBe(false)
    expect(filterFn_inDateRange(makeValueRow('nope'), 'value', range)).toBe(
      false,
    )
  })

  it('auto-removes only fully blank ranges', () => {
    expect(filterFn_inDateRange.autoRemove!(undefined)).toBe(true)
    expect(filterFn_inDateRange.autoRemove!([null, null])).toBe(true)
    expect(filterFn_inDateRange.autoRemove!([new Date(0), null])).toBe(false)
  })
})

describe('filter fn registry', () => {
  it('registers the case-sensitive string equality filter fn', () => {
    expect(filterFns.equalsStringSensitive).toBe(filterFn_equalsStringSensitive)
  })

  it('registers the new built-in filter fns', () => {
    expect(filterFns.startsWith).toBe(filterFn_startsWith)
    expect(filterFns.endsWith).toBe(filterFn_endsWith)
    expect(filterFns.empty).toBe(filterFn_empty)
    expect(filterFns.notEmpty).toBe(filterFn_notEmpty)
    expect(filterFns.inDateRange).toBe(filterFn_inDateRange)
  })
})

describe('auto filter fn for date columns', () => {
  const dateFeatures = testFeatures({
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  })

  type Event = { name: string; when: Date | null }

  const dateTable = constructTable<typeof dateFeatures, Event>({
    features: dateFeatures,
    data: [
      { name: 'too early', when: new Date('2026-01-01') },
      { name: 'in range', when: new Date('2026-01-10') },
      { name: 'no date', when: null },
      { name: 'too late', when: new Date('2026-01-20') },
    ],
    columns: [
      { accessorKey: 'name', id: 'name' },
      { accessorKey: 'when', id: 'when', filterFn: 'auto' },
    ],
    initialState: {
      columnFilters: [
        { id: 'when', value: [new Date('2026-01-05'), new Date('2026-01-15')] },
      ],
    },
  })

  it('resolves inDateRange for Date-valued columns', () => {
    expect(dateTable.getColumn('when')!.getAutoFilterFn()).toBe(
      filterFns.inDateRange,
    )
  })

  it('filters date rows through the table row model', () => {
    expect(
      dateTable.getFilteredRowModel().rows.map((row) => row.original.name),
    ).toEqual(['in range'])
  })
})
