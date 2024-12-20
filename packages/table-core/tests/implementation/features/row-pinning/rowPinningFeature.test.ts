import { describe, expect, it } from 'vitest'
import { createPaginatedRowModel, rowPaginationFeature } from '../../../../src'
import { createRowPinningTable } from '../../../helpers/rowPinningHelpers'

const ROW = {
  0: '0',
  1: '1',
  2: '2',
} as const

const SUB_ROW = {
  0: '0.0',
  1: '0.1',
}

const EMPTY_PINNING_STATE = {
  top: [],
  bottom: [],
}

describe('table methods', () => {
  describe('setRowPinning', () => {
    it('should update pinning state', () => {
      const table = createRowPinningTable()
      const newState = {
        top: [ROW[0]],
        bottom: [ROW[1]],
      }

      table.setRowPinning(newState)

      expect(table.getState().rowPinning).toEqual(newState)
    })
  })

  describe('resetRowPinning', () => {
    it('should reset to default state when defaultState is true', () => {
      const table = createRowPinningTable()

      table.setRowPinning({
        top: [ROW[0]],
        bottom: [ROW[1]],
      })

      table.resetRowPinning(true)

      expect(table.getState().rowPinning).toEqual(EMPTY_PINNING_STATE)
    })

    it('should reset to initial state when defaultState is false', () => {
      const initialState = {
        top: [ROW[0]],
        bottom: [ROW[1]],
      }
      const table = createRowPinningTable({
        _features: {},
        initialState: {
          rowPinning: initialState,
        },
      })

      table.setRowPinning({
        top: [ROW[2]],
        bottom: [],
      })

      table.resetRowPinning(false)

      expect(table.getState().rowPinning).toEqual(initialState)
    })
  })

  describe('getIsSomeRowsPinned', () => {
    it('should return false when no rows are pinned', () => {
      const table = createRowPinningTable()
      expect(table.getIsSomeRowsPinned()).toBe(false)
      expect(table.getIsSomeRowsPinned('top')).toBe(false)
      expect(table.getIsSomeRowsPinned('bottom')).toBe(false)
    })

    it('should return true when rows are pinned', () => {
      const table = createRowPinningTable()
      table.setRowPinning({
        top: [ROW[0]],
        bottom: [ROW[1]],
      })

      expect(table.getIsSomeRowsPinned()).toBe(true)
      expect(table.getIsSomeRowsPinned('top')).toBe(true)
      expect(table.getIsSomeRowsPinned('bottom')).toBe(true)
    })
  })

  describe('getTopRows/getBottomRows/getCenterRows', () => {
    it('should return correct rows for each section', () => {
      const table = createRowPinningTable({
        _features: {},
        initialState: {
          rowPinning: {
            top: [ROW[0]],
            bottom: [ROW[2]],
          },
        },
      })

      const topRows = table.getTopRows()
      const bottomRows = table.getBottomRows()
      const centerRows = table.getCenterRows()

      expect(topRows).toHaveLength(1)
      expect(topRows[0]?.id).toBe(ROW[0])

      expect(bottomRows).toHaveLength(1)
      expect(bottomRows[0]?.id).toBe(ROW[2])

      expect(centerRows).toHaveLength(8)
      expect(
        centerRows.every((row) => row.id !== ROW[0] && row.id !== ROW[2]),
      ).toBe(true)
    })

    it('should handle keepPinnedRows - false', () => {
      const table = createRowPinningTable({
        _features: {
          rowPaginationFeature,
        },
        _rowModels: {
          paginatedRowModel: createPaginatedRowModel(),
        },
        initialState: {
          // Make first 2 rows visible
          pagination: {
            pageSize: 2,
            pageIndex: 0,
          },
          rowPinning: {
            top: [ROW[0]],
            bottom: [ROW[2]],
          },
        },
        keepPinnedRows: false,
      })

      expect(table.getTopRows()).toHaveLength(1)
      expect(table.getBottomRows()).toHaveLength(0) // Row 2 is not in visible rows
    })
  })

  it('should handle keepPinnedRows - true', () => {
    const table = createRowPinningTable({
      _features: {
        rowPaginationFeature,
      },
      _rowModels: {
        paginatedRowModel: createPaginatedRowModel(),
      },
      initialState: {
        // Make first 2 rows visible
        pagination: {
          pageSize: 2,
          pageIndex: 0,
        },
        rowPinning: {
          top: [ROW[0]],
          bottom: [ROW[2]],
        },
      },
      keepPinnedRows: true,
    })

    expect(table.getTopRows()).toHaveLength(1)
    expect(table.getBottomRows()).toHaveLength(1)
  })
})

describe('row methods', () => {
  describe('getCanPin', () => {
    it('should return true by default', () => {
      const table = createRowPinningTable()
      const row = table.getRow(ROW[0])

      expect(row.getCanPin()).toBe(true)
    })

    it('should return false when enableRowPinning is false', () => {
      const table = createRowPinningTable({
        _features: {},
        enableRowPinning: false,
      })
      const row = table.getRow(ROW[0])

      expect(row.getCanPin()).toBe(false)
    })

    it('should use enableRowPinning function when provided', () => {
      const table = createRowPinningTable({
        _features: {},
        enableRowPinning: (row) => row.id === ROW[1],
      })

      expect(table.getRow(ROW[0]).getCanPin()).toBe(false)
      expect(table.getRow(ROW[1]).getCanPin()).toBe(true)
    })
  })

  describe('getIsPinned', () => {
    it('should return false when row is not pinned', () => {
      const table = createRowPinningTable()
      const row = table.getRow(ROW[0])

      expect(row.getIsPinned()).toBe(false)
    })

    it('should return correct position when row is pinned', () => {
      const table = createRowPinningTable({
        _features: {},
        initialState: {
          rowPinning: {
            top: [ROW[0]],
            bottom: [ROW[1]],
          },
        },
      })

      expect(table.getRow(ROW[0]).getIsPinned()).toBe('top')
      expect(table.getRow(ROW[1]).getIsPinned()).toBe('bottom')
    })
  })

  describe('getPinnedIndex', () => {
    it('should return -1 when row is not pinned', () => {
      const table = createRowPinningTable()
      const row = table.getRow(ROW[0])

      expect(row.getPinnedIndex()).toBe(-1)
    })

    it('should return correct index for pinned rows', () => {
      const table = createRowPinningTable({
        _features: {},
        initialState: {
          rowPinning: {
            top: [ROW[0], ROW[1]],
            bottom: [ROW[2]],
          },
        },
      })

      expect(table.getRow(ROW[0]).getPinnedIndex()).toBe(0)
      expect(table.getRow(ROW[1]).getPinnedIndex()).toBe(1)
      expect(table.getRow(ROW[2]).getPinnedIndex()).toBe(0)
    })
  })

  describe('pin', () => {
    it('should pin row to specified position', () => {
      const table = createRowPinningTable()
      const row = table.getRow(ROW[0])

      row.pin('top')
      expect(table.getState().rowPinning.top).toEqual([ROW[0]])

      row.pin('bottom')
      expect(table.getState().rowPinning.bottom).toEqual([ROW[0]])
      expect(table.getState().rowPinning.top).toEqual([])
    })

    it('should unpin row when position is false', () => {
      const table = createRowPinningTable({
        _features: {},
        initialState: {
          rowPinning: {
            top: [ROW[0]],
            bottom: [],
          },
        },
      })
      const row = table.getRow(ROW[0])

      row.pin(false)
      expect(table.getState().rowPinning).toEqual(EMPTY_PINNING_STATE)
    })

    it('should include leaf rows when includeLeafRows is true', () => {
      const table = createRowPinningTable({ _features: {} }, [10, 2])
      const row = table.getRow(ROW[0])

      // Mock leaf rows by pinning multiple rows
      row.pin('top', true)

      // Verify the row was pinned
      expect(table.getState().rowPinning.top).toContain(ROW[0])

      // Verify the leaf rows were pinned
      expect(table.getState().rowPinning.top).toContain(SUB_ROW[0])
      expect(table.getState().rowPinning.top).toContain(SUB_ROW[1])
    })

    it('should include parent rows when includeParentRows is true', () => {
      const table = createRowPinningTable({ _features: {} }, [10, 5])

      const row = table.getRow(SUB_ROW[0])

      row.pin('top', false, true)

      // Verify the row was pinned
      expect(table.getState().rowPinning.top).toContain(SUB_ROW[0])

      // Verify the parent row was pinned
      expect(table.getState().rowPinning.top).toContain(ROW[0])
    })
  })
})
