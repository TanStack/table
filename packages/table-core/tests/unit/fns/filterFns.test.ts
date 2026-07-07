import { describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_equalsStringSensitive,
  filterFn_greaterThan,
  filterFn_greaterThanOrEqualTo,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_lessThan,
  filterFn_lessThanOrEqualTo,
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
      it('should match case-insensitive substrings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'John'
        const result = filterFn_includesString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match different case substrings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'john' // lowercase
        const result = filterFn_includesString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should handle partial matches', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'ohn'
        const result = filterFn_includesString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should normalize resolved filter values for row-model filtering', () => {
        expect(filterFn_includesString.resolveFilterValue?.('JoH')).toBe('joh')
        expect(filterFn_includesString.resolveFilterValue?.(123)).toBe('123')
      })
    })

    describe('filterFn_equalsString', () => {
      it('should match exact strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'John'
        const result = filterFn_equalsString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should match case-insensitive exact strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'john' // lowercase
        const result = filterFn_equalsString(row, columnId, filterValue)
        expect(result).toBe(true)
      })
      it('should not match partial strings', () => {
        const row = mockRows[0]!
        const columnId = 'firstName'
        const filterValue = 'ohn'
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
      const autoRemove = filterFns.between.autoRemove

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
    })

    describe('filterFns.betweenInclusive.autoRemove', () => {
      const autoRemove = filterFns.betweenInclusive.autoRemove

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
      const autoRemove = filterFns.arrHas.autoRemove

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
      expect(filterFn_inNumberRange.resolveFilterValue(['29', '31'])).toEqual([
        29, 31,
      ])
    })

    it('should treat null and non-numeric endpoints as open-ended', () => {
      expect(filterFn_inNumberRange.resolveFilterValue([null, 31])).toEqual([
        -Infinity,
        31,
      ])
      expect(filterFn_inNumberRange.resolveFilterValue([29, 'abc'])).toEqual([
        29,
        Infinity,
      ])
    })

    it('should swap reversed ranges', () => {
      expect(filterFn_inNumberRange.resolveFilterValue([31, 29])).toEqual([
        29, 31,
      ])
    })

    it('should auto-remove only fully empty ranges', () => {
      const autoRemove = filterFn_inNumberRange.autoRemove

      expect(autoRemove(undefined)).toBe(true)
      expect(autoRemove([null, null])).toBe(true)
      expect(autoRemove(['', ''])).toBe(true)
      expect(autoRemove([5, undefined])).toBe(false)
      expect(autoRemove([undefined, 10])).toBe(false)
      expect(autoRemove([0, 10])).toBe(false)
    })
  })
})
