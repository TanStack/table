import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowPinningFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  rowPinningFeature,
})

const featuresWithPagination = testFeatures({
  rowPaginationFeature,
  rowPinningFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
  lengths: Array<number> | number = 10,
): Table<typeof features, Person> {
  const lengthsArray = Array.isArray(lengths) ? lengths : [lengths]
  const data = generateTestData(...lengthsArray)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    getSubRows: (row) => row.subRows,
    enableRowPinning: true,
    ...options,
  })
}

function makeTableWithMockOnPinningChange(rowCount = 10) {
  const onRowPinningChangeMock = vi.fn()
  const table = makeTable(
    { onRowPinningChange: onRowPinningChangeMock },
    rowCount,
  )
  return { table, onRowPinningChangeMock }
}

const ROW = {
  0: '0',
  1: '1',
  2: '2',
} as const

const EMPTY_PINNING_STATE = {
  top: [],
  bottom: [],
}

describe('table methods', () => {
  describe('setRowPinning', () => {
    it('should call onRowPinningChange when invoked', () => {
      const { table, onRowPinningChangeMock } =
        makeTableWithMockOnPinningChange()

      const newState = {
        top: [ROW[0]],
        bottom: [ROW[1]],
      }

      table.setRowPinning(newState)

      expect(onRowPinningChangeMock).toHaveBeenCalledWith(newState)
    })
  })

  describe('resetRowPinning', () => {
    it('should reset to default state when defaultState is true', () => {
      const table = makeTable()

      table.setRowPinning({
        top: [ROW[0]],
        bottom: [ROW[1]],
      })

      table.resetRowPinning(true)

      expect(table.atoms.rowPinning.get()).toEqual(EMPTY_PINNING_STATE)
    })

    it('should reset to initial state when defaultState is false', () => {
      const initialState = {
        top: [ROW[0]],
        bottom: [ROW[1]],
      }
      const table = makeTable({
        initialState: {
          rowPinning: initialState,
        },
      })

      table.setRowPinning({
        top: [ROW[2]],
        bottom: [],
      })

      table.resetRowPinning(false)

      expect(table.atoms.rowPinning.get()).toEqual(initialState)
    })
  })

  describe('getIsSomeRowsPinned', () => {
    it('should return false when no rows are pinned', () => {
      const table = makeTable()
      expect(table.getIsSomeRowsPinned()).toBe(false)
      expect(table.getIsSomeRowsPinned('top')).toBe(false)
      expect(table.getIsSomeRowsPinned('bottom')).toBe(false)
    })

    it('should return true when rows are pinned', () => {
      const table = makeTable({
        initialState: {
          rowPinning: {
            top: [ROW[0]],
            bottom: [ROW[1]],
          },
        },
      })

      expect(table.getIsSomeRowsPinned()).toBe(true)
      expect(table.getIsSomeRowsPinned('top')).toBe(true)
      expect(table.getIsSomeRowsPinned('bottom')).toBe(true)
    })
  })

  describe('getTopRows/getBottomRows/getCenterRows', () => {
    it('should return correct rows for each section', () => {
      const table = makeTable({
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
      const data = generateTestData(10)
      const columns =
        generateTestColumnDefs<typeof featuresWithPagination>(data)

      const table = constructTable({
        features: featuresWithPagination,
        data,
        columns,
        getSubRows: (row) => row.subRows,
        enableRowPinning: true,
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
    const data = generateTestData(10)
    const columns = generateTestColumnDefs<typeof featuresWithPagination>(data)

    const table = constructTable({
      features: featuresWithPagination,
      data,
      columns,
      getSubRows: (row) => row.subRows,
      enableRowPinning: true,
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
      const table = makeTable()
      const row = table.getRow(ROW[0])

      expect(row.getCanPin()).toBe(true)
    })

    it('should return false when enableRowPinning is false', () => {
      const table = makeTable({
        enableRowPinning: false,
      })
      const row = table.getRow(ROW[0])

      expect(row.getCanPin()).toBe(false)
    })

    it('should use enableRowPinning function when provided', () => {
      const table = makeTable({
        enableRowPinning: (row) => row.id === ROW[1],
      })

      expect(table.getRow(ROW[0]).getCanPin()).toBe(false)
      expect(table.getRow(ROW[1]).getCanPin()).toBe(true)
    })
  })

  describe('getIsPinned', () => {
    it('should return false when row is not pinned', () => {
      const table = makeTable()
      const row = table.getRow(ROW[0])

      expect(row.getIsPinned()).toBe(false)
    })

    it('should return correct position when row is pinned', () => {
      const table = makeTable({
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
      const table = makeTable()
      const row = table.getRow(ROW[0])

      expect(row.getPinnedIndex()).toBe(-1)
    })

    it('should return correct index for pinned rows', () => {
      const table = makeTable({
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
    it('should call onRowPinningChange when pinning row', () => {
      const { table, onRowPinningChangeMock } =
        makeTableWithMockOnPinningChange()
      const row = table.getRow(ROW[0])

      row.pin('top')

      expect(onRowPinningChangeMock).toHaveBeenCalled()
      // The exact call pattern would depend on row.pin implementation
      // This test verifies the callback mechanism works
    })

    it('should call onRowPinningChange when unpinning row', () => {
      const { table, onRowPinningChangeMock } =
        makeTableWithMockOnPinningChange()
      // Set up initial state with a pinned row
      table.baseAtoms.rowPinning.set({
        top: [ROW[0]],
        bottom: [],
      })
      const row = table.getRow(ROW[0])

      row.pin(false)

      expect(onRowPinningChangeMock).toHaveBeenCalled()
    })

    it('should call onRowPinningChange when including leaf rows', () => {
      const { table, onRowPinningChangeMock } =
        makeTableWithMockOnPinningChange(10)
      const row = table.getRow(ROW[0])

      row.pin('top', true)

      expect(onRowPinningChangeMock).toHaveBeenCalled()
      // The callback should be invoked when pinning with leaf rows
    })

    it('should call onRowPinningChange when including parent rows', () => {
      const { table, onRowPinningChangeMock } =
        makeTableWithMockOnPinningChange(10)
      const row = table.getRow(ROW[0])

      row.pin('top', false, true)

      expect(onRowPinningChangeMock).toHaveBeenCalled()
      // The callback should be invoked when pinning with parent rows
    })
  })
})
