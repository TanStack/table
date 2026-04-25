import { describe, expect, it } from 'vitest'
import {
  constructTable,
  coreFeatures,
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowPinningFeature,
} from '../../../../src'
import {
  createRowPinningTable,
  createTableWithMockOnPinningChange,
} from '../../../helpers/rowPinningHelpers'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { ColumnDef, Row } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

// Define feature set with proper typing
const _features = {
  ...coreFeatures,
  rowPinningFeature,
}

type personKeys = keyof Person
type PersonColumn = ColumnDef<typeof _features, Person, any>

function generateColumnDefs(people: Array<Person>): Array<PersonColumn> {
  const columnHelper = createColumnHelper<typeof _features, Person>()
  const person = people[0]

  if (!person) {
    return []
  }

  return Object.keys(person).map((key) => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

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
    it('should call onRowPinningChange when invoked', () => {
      const { table, onRowPinningChangeMock } =
        createTableWithMockOnPinningChange()

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
      const table = createRowPinningTable()

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
      const table = createRowPinningTable({
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
      const table = createRowPinningTable()
      expect(table.getIsSomeRowsPinned()).toBe(false)
      expect(table.getIsSomeRowsPinned('top')).toBe(false)
      expect(table.getIsSomeRowsPinned('bottom')).toBe(false)
    })

    it('should return true when rows are pinned', () => {
      const table = createRowPinningTable({
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
      const table = createRowPinningTable({
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
        centerRows.every(
          (row: (typeof centerRows)[number]) =>
            row.id !== ROW[0] && row.id !== ROW[2],
        ),
      ).toBe(true)
    })

    it('should handle keepPinnedRows - false', () => {
      const data = generateTestData(10)
      const columns = generateColumnDefs(data)

      const _featuresWithPagination = {
        ...coreFeatures,
        rowPinningFeature,
        rowPaginationFeature,
      }

      const table = constructTable<typeof _featuresWithPagination, Person>({
        _features: _featuresWithPagination,
        _rowModels: {
          paginatedRowModel: createPaginatedRowModel(),
        },
        data,
        columns,
        getSubRows: (row) => row.subRows,
        enableRowPinning: true,
        renderFallbackValue: '',
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
    const columns = generateColumnDefs(data)

    const _featuresWithPagination = {
      ...coreFeatures,
      rowPinningFeature,
      rowPaginationFeature,
    }

    const table = constructTable<typeof _featuresWithPagination, Person>({
      _features: _featuresWithPagination,
      _rowModels: {
        paginatedRowModel: createPaginatedRowModel(),
      },
      data,
      columns,
      getSubRows: (row) => row.subRows,
      enableRowPinning: true,
      renderFallbackValue: '',
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
        enableRowPinning: false,
      })
      const row = table.getRow(ROW[0])

      expect(row.getCanPin()).toBe(false)
    })

    it('should use enableRowPinning function when provided', () => {
      const table = createRowPinningTable({
        enableRowPinning: (row: Row<any, any>) => row.id === ROW[1],
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
        createTableWithMockOnPinningChange()
      const row = table.getRow(ROW[0])

      row.pin('top')

      expect(onRowPinningChangeMock).toHaveBeenCalled()
      // The exact call pattern would depend on row.pin implementation
      // This test verifies the callback mechanism works
    })

    it('should call onRowPinningChange when unpinning row', () => {
      const { table, onRowPinningChangeMock } =
        createTableWithMockOnPinningChange()
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
        createTableWithMockOnPinningChange(10)
      const row = table.getRow(ROW[0])

      row.pin('top', true)

      expect(onRowPinningChangeMock).toHaveBeenCalled()
      // The callback should be invoked when pinning with leaf rows
    })

    it('should call onRowPinningChange when including parent rows', () => {
      const { table, onRowPinningChangeMock } =
        createTableWithMockOnPinningChange(10)
      const row = table.getRow(ROW[0])

      row.pin('top', false, true)

      expect(onRowPinningChangeMock).toHaveBeenCalled()
      // The callback should be invoked when pinning with parent rows
    })
  })
})
