import { describe, expect, it, vi } from 'vitest'
import {
  getDefaultPaginationState,
  rowPaginationFeature,
  table_autoResetPageIndex,
  table_resetPageIndex,
  table_setPageIndex,
  table_setPagination,
} from '../../../../src'
import { generateTestTableWithData } from '../../../helpers/generateTestTable'

type TestFeatures = {
  rowPaginationFeature: {}
}

function createPaginationTable(onPaginationChange?: (...args: any[]) => void) {
  const table = generateTestTableWithData<TestFeatures>(10, {
    _features: {
      rowPaginationFeature,
    },
    ...(onPaginationChange && { onPaginationChange }),
  } as any)
  return table
}

describe('rowPaginationFeature.utils', () => {
  describe('getDefaultPaginationState', () => {
    it('should return default pagination state', () => {
      const state = getDefaultPaginationState()
      expect(state).toEqual({ pageIndex: 0, pageSize: 10 })
    })
  })

  describe('table_setPagination', () => {
    it('should call onPaginationChange when state actually changes', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      table_setPagination(table as any, { pageIndex: 2, pageSize: 10 })

      expect(onPaginationChange).toHaveBeenCalledTimes(1)
    })

    it('should NOT call onPaginationChange when state is unchanged (object updater)', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      // Set same values as default (pageIndex: 0, pageSize: 10)
      table_setPagination(table as any, { pageIndex: 0, pageSize: 10 })

      expect(onPaginationChange).not.toHaveBeenCalled()
    })

    it('should NOT call onPaginationChange when function updater returns same state', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      table_setPagination(table as any, (old) => ({ ...old }))

      expect(onPaginationChange).not.toHaveBeenCalled()
    })

    it('should call onPaginationChange when function updater changes pageIndex', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      table_setPagination(table as any, (old) => ({
        ...old,
        pageIndex: old.pageIndex + 1,
      }))

      expect(onPaginationChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('table_setPageIndex', () => {
    it('should NOT trigger onPaginationChange when pageIndex is already at target', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      // Default pageIndex is 0, setting to 0 should be a no-op
      table_setPageIndex(table as any, 0)

      expect(onPaginationChange).not.toHaveBeenCalled()
    })

    it('should trigger onPaginationChange when pageIndex changes', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      table_setPageIndex(table as any, 1)

      expect(onPaginationChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('table_resetPageIndex', () => {
    it('should NOT trigger onPaginationChange when already at default', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      // Already at default pageIndex (0), reset should be a no-op
      table_resetPageIndex(table as any, true)

      expect(onPaginationChange).not.toHaveBeenCalled()
    })
  })

  describe('table_autoResetPageIndex', () => {
    it('should NOT trigger onPaginationChange when page index is already at default', () => {
      const onPaginationChange = vi.fn()
      const table = createPaginationTable(onPaginationChange)

      // autoResetPageIndex resets to initial/default, which is already 0
      table_autoResetPageIndex(table as any)

      expect(onPaginationChange).not.toHaveBeenCalled()
    })
  })
})
