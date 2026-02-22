import { describe, it, expect } from 'vitest'
import { FilterFn } from '../src'
import { shouldAutoRemoveFilter } from '../src/features/ColumnFiltering'

const customAutoRemove: FilterFn<any> = (row, columnId, filterValue) => {
  return filterValue === row.getValue(columnId)
}
customAutoRemove.autoRemove = (val) => val === undefined

const neverAutoRemove: FilterFn<any> = (row, columnId, filterValue) => {
  return filterValue === row.getValue(columnId)
}
neverAutoRemove.autoRemove = () => false

const noAutoRemove: FilterFn<any> = (row, columnId, filterValue) => {
  return filterValue === row.getValue(columnId)
}

describe('shouldAutoRemoveFilter', () => {
  describe('with custom autoRemove defined', () => {
    it('should use custom autoRemove result for empty string', () => {
      expect(shouldAutoRemoveFilter(customAutoRemove, '')).toBe(false)
    })

    it('should use custom autoRemove result for undefined', () => {
      expect(shouldAutoRemoveFilter(customAutoRemove, undefined)).toBe(true)
    })

    it('should use custom autoRemove result for null', () => {
      expect(shouldAutoRemoveFilter(customAutoRemove, null)).toBe(false)
    })

    it('should use custom autoRemove result for zero', () => {
      expect(shouldAutoRemoveFilter(customAutoRemove, 0)).toBe(false)
    })

    it('should use custom autoRemove result for false', () => {
      expect(shouldAutoRemoveFilter(customAutoRemove, false)).toBe(false)
    })

    it('should keep undefined filter when custom autoRemove returns false for it', () => {
      expect(shouldAutoRemoveFilter(neverAutoRemove, undefined)).toBe(false)
    })
  })

  describe('without autoRemove defined', () => {
    it('should remove undefined filter', () => {
      expect(shouldAutoRemoveFilter(noAutoRemove, undefined)).toBe(true)
    })

    it('should remove empty string filter', () => {
      expect(shouldAutoRemoveFilter(noAutoRemove, '')).toBe(true)
    })

    it('should keep null filter', () => {
      expect(shouldAutoRemoveFilter(noAutoRemove, null)).toBe(false)
    })
  })

  describe('without filterFn', () => {
    it('should remove undefined filter', () => {
      expect(shouldAutoRemoveFilter(undefined, undefined)).toBe(true)
    })

    it('should remove empty string filter', () => {
      expect(shouldAutoRemoveFilter(undefined, '')).toBe(true)
    })

    it('should keep null filter', () => {
      expect(shouldAutoRemoveFilter(undefined, null)).toBe(false)
    })
  })
})
