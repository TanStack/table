import { describe, expect, it, vi } from 'vitest'
import {
  getDefaultRowPinningState,
  row_getCanPin,
  row_getIsPinned,
  row_getPinnedIndex,
  row_pin,
  table_getBottomRows,
  table_getCenterRows,
  table_getIsSomeRowsPinned,
  table_getTopRows,
  table_resetRowPinning,
  table_setRowPinning,
} from '../../../../src/features/row-pinning/rowPinningFeature.utils'
import { generateTestTableWithData } from '../../../helpers/generateTestTable'
import { getUpdaterResult } from '../../../helpers/testUtils'
import {
  createTableWithMockOnPinningChange,
  createTableWithPinningState,
} from '../../../helpers/rowPinningHelpers'
import type { Row } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const DEFAULT_ROW_COUNT = 10

const ROW = {
  0: '0',
  1: '1',
  2: '2',
  8: '8',
  9: '9',
} as const

const LEAF = {
  1: 'leaf1',
  2: 'leaf2',
} as const

const PARENT = {
  1: 'parent1',
  2: 'parent2',
} as const

const EMPTY_PINNING_STATE = {
  top: [],
  bottom: [],
}

describe('getDefaultRowPinningState', () => {
  it('should return default row pinning state with empty top and bottom arrays', () => {
    const defaultState = getDefaultRowPinningState()

    expect(defaultState).toEqual({
      top: [],
      bottom: [],
    })

    // Ensure we get a new object instance each time
    const secondState = getDefaultRowPinningState()
    expect(secondState).toEqual(defaultState)
    expect(secondState).not.toBe(defaultState)
  })
})

describe('table_setRowPinning', () => {
  it('should call onRowPinningChange with the updater function', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()

    const newState = {
      top: [ROW[1]],
      bottom: [ROW[2]],
    }

    table_setRowPinning(table, newState)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(onRowPinningChangeMock).toHaveBeenCalledWith(newState)
  })

  it('should handle undefined onRowPinningChange without error', () => {
    const table = generateTestTableWithData(DEFAULT_ROW_COUNT)

    expect(() => {
      table_setRowPinning(table, EMPTY_PINNING_STATE)
    }).not.toThrow()
  })
})

describe('table_resetRowPinning', () => {
  it('should reset to default state when defaultState is true', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()

    table_resetRowPinning(table, true)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(onRowPinningChangeMock).toHaveBeenCalledWith(
      getDefaultRowPinningState(),
    )
  })

  it('should reset to initial state when defaultState is false', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    const initialState = {
      top: [ROW[1]],
      bottom: [ROW[2]],
    }
    table.initialState.rowPinning = initialState

    table_resetRowPinning(table, false)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(onRowPinningChangeMock).toHaveBeenCalledWith(initialState)
  })

  it('should reset to default state when no initial state exists', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()

    table_resetRowPinning(table, false)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(onRowPinningChangeMock).toHaveBeenCalledWith(
      getDefaultRowPinningState(),
    )
  })
})

describe('table_getIsSomeRowsPinned', () => {
  it('should return false when no rows are pinned', () => {
    const table = createTableWithPinningState()

    expect(table_getIsSomeRowsPinned(table)).toBe(false)
    expect(table_getIsSomeRowsPinned(table, 'top')).toBe(false)
    expect(table_getIsSomeRowsPinned(table, 'bottom')).toBe(false)
  })

  it('should return true when rows are pinned to top', () => {
    const table = createTableWithPinningState(10, {
      top: [ROW[0]],
      bottom: [],
    })

    expect(table_getIsSomeRowsPinned(table)).toBe(true)
    expect(table_getIsSomeRowsPinned(table, 'top')).toBe(true)
    expect(table_getIsSomeRowsPinned(table, 'bottom')).toBe(false)
  })

  it('should return true when rows are pinned to bottom', () => {
    const table = createTableWithPinningState(10, {
      top: [],
      bottom: [ROW[0]],
    })

    expect(table_getIsSomeRowsPinned(table)).toBe(true)
    expect(table_getIsSomeRowsPinned(table, 'top')).toBe(false)
    expect(table_getIsSomeRowsPinned(table, 'bottom')).toBe(true)
  })

  it('should handle undefined state', () => {
    const table = createTableWithPinningState()
    table.options.state = undefined

    expect(table_getIsSomeRowsPinned(table)).toBe(false)
    expect(table_getIsSomeRowsPinned(table, 'top')).toBe(false)
    expect(table_getIsSomeRowsPinned(table, 'bottom')).toBe(false)
  })
})

describe('table_getTopRows and table_getBottomRows', () => {
  it('should return empty arrays when no rows are pinned', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: getDefaultRowPinningState(),
    }

    expect(table_getTopRows(table)).toEqual([])
    expect(table_getBottomRows(table)).toEqual([])
  })

  it('should return pinned rows with position property', () => {
    const table = generateTestTableWithData(10)
    const row0 = table.getRow('0', true)
    const row1 = table.getRow('1', true)

    table.options.state = {
      rowPinning: {
        top: [ROW[0]],
        bottom: [ROW[1]],
      },
    }

    const topRows = table_getTopRows(table)
    const bottomRows = table_getBottomRows(table)

    expect(topRows).toHaveLength(1)
    expect(topRows[0]).toEqual({ ...row0, position: 'top' })

    expect(bottomRows).toHaveLength(1)
    expect(bottomRows[0]).toEqual({ ...row1, position: 'bottom' })
  })

  it('should handle keepPinnedRows=false by only returning visible rows', () => {
    const table = generateTestTableWithData(10)
    table.options.keepPinnedRows = false

    // Setup a row model with only some rows visible
    const visibleRows = table.getRowModel().rows.slice(0, 5)
    vi.spyOn(table, 'getRowModel').mockReturnValue({
      rows: visibleRows,
      flatRows: [],
      rowsById: {},
    })

    table.options.state = {
      rowPinning: {
        top: [ROW[0], ROW[8]], // '0' is visible, '8' is not
        bottom: [ROW[1], ROW[9]], // '1' is visible, '9' is not
      },
    }

    const topRows = table_getTopRows(table)
    const bottomRows = table_getBottomRows(table)

    expect(topRows).toHaveLength(1)
    expect(topRows[0]?.id).toBe(ROW[0])

    expect(bottomRows).toHaveLength(1)
    expect(bottomRows[0]?.id).toBe(ROW[1])
  })

  it('should handle keepPinnedRows=true by returning all pinned rows regardless of visibility', () => {
    const table = generateTestTableWithData(10)
    table.options.keepPinnedRows = true

    // Setup a row model with only some rows visible
    const visibleRows = table.getRowModel().rows.slice(0, 5)
    vi.spyOn(table, 'getRowModel').mockReturnValue({
      rows: visibleRows,
      flatRows: [],
      rowsById: {},
    })

    table.options.state = {
      rowPinning: {
        top: [ROW[0], ROW[8]], // '0' is visible, '8' is not
        bottom: [ROW[1], ROW[9]], // '1' is visible, '9' is not
      },
    }

    const topRows = table_getTopRows(table)
    const bottomRows = table_getBottomRows(table)

    expect(topRows).toHaveLength(2)
    expect(topRows.map((r) => r.id)).toEqual([ROW[0], ROW[8]])

    expect(bottomRows).toHaveLength(2)
    expect(bottomRows.map((r) => r.id)).toEqual([ROW[1], ROW[9]])
  })

  it('should handle undefined state', () => {
    const table = generateTestTableWithData(10)
    table.options.state = undefined

    expect(table_getTopRows(table)).toEqual([])
    expect(table_getBottomRows(table)).toEqual([])
  })
})

describe('table_getCenterRows', () => {
  it('should return all rows when no rows are pinned', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: getDefaultRowPinningState(),
    }

    const allRows = table.getRowModel().rows
    const centerRows = table_getCenterRows(table)

    expect(centerRows).toEqual(allRows)
  })

  it('should return only unpinned rows when some rows are pinned', () => {
    const table = generateTestTableWithData(10)
    const allRows = table.getRowModel().rows

    table.options.state = {
      rowPinning: {
        top: [ROW[0], ROW[1]],
        bottom: [ROW[8], ROW[9]],
      },
    }

    const centerRows = table_getCenterRows(table)

    expect(centerRows).toEqual(allRows.slice(2, 8))
    const rowIds = [ROW[0], ROW[1], ROW[8], ROW[9]] as Array<string>

    expect(centerRows.every((row) => !rowIds.includes(row.id))).toBe(true)
  })

  it('should handle undefined state', () => {
    const table = generateTestTableWithData(10)
    const allRows = table.getRowModel().rows
    table.options.state = undefined

    const centerRows = table_getCenterRows(table)

    expect(centerRows).toEqual(allRows)
  })
})

describe('row_getCanPin', () => {
  it('should return true when enableRowPinning is undefined', () => {
    const table = generateTestTableWithData(10)
    const row = table.getRow('0')

    expect(row_getCanPin(row)).toBe(true)
  })

  it('should return false when enableRowPinning is false', () => {
    const table = generateTestTableWithData(10)
    table.options.enableRowPinning = false

    const row = table.getRow('0')

    expect(row_getCanPin(row)).toBe(false)
  })

  it('should return true when enableRowPinning is true', () => {
    const table = generateTestTableWithData(10)
    table.options.enableRowPinning = true

    const row = table.getRow('0')

    expect(row_getCanPin(row)).toBe(true)
  })

  it('should use enableRowPinning function when provided', () => {
    const enableRowPinning = vi.fn((row) => row.id === '1')
    const table = generateTestTableWithData(10)

    table.options.enableRowPinning = enableRowPinning

    const row0 = table.getRow('0')
    const row1 = table.getRow('1')

    expect(row_getCanPin(row0)).toBe(false)
    expect(row_getCanPin(row1)).toBe(true)
    expect(enableRowPinning).toHaveBeenCalledTimes(2)
  })
})

describe('row_getIsPinned', () => {
  it('should return false when no rows are pinned', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: getDefaultRowPinningState(),
    }

    const row = table.getRow('0')
    expect(row_getIsPinned(row)).toBe(false)
  })

  it('should return "top" when row is pinned to top', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: {
        top: [ROW[0]],
        bottom: [],
      },
    }

    const row = table.getRow('0')
    expect(row_getIsPinned(row)).toBe('top')
  })

  it('should return "bottom" when row is pinned to bottom', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: {
        top: [],
        bottom: [ROW[0]],
      },
    }

    const row = table.getRow('0')
    expect(row_getIsPinned(row)).toBe('bottom')
  })

  it('should handle undefined state', () => {
    const table = generateTestTableWithData(10)
    table.options.state = undefined

    const row = table.getRow('0')
    expect(row_getIsPinned(row)).toBe(false)
  })
})

describe('row_getPinnedIndex', () => {
  it('should return -1 when row is not pinned', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: getDefaultRowPinningState(),
    }

    const row = table.getRow('0')
    expect(row_getPinnedIndex(row)).toBe(-1)
  })

  it('should return correct index for top pinned rows', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: {
        top: [ROW[0], ROW[1], ROW[2]],
        bottom: [],
      },
    }

    expect(row_getPinnedIndex(table.getRow('0'))).toBe(0)
    expect(row_getPinnedIndex(table.getRow('1'))).toBe(1)
    expect(row_getPinnedIndex(table.getRow('2'))).toBe(2)
  })

  it('should return correct index for bottom pinned rows', () => {
    const table = generateTestTableWithData(10)
    table.options.state = {
      rowPinning: {
        top: [],
        bottom: [ROW[0], ROW[1], ROW[2]],
      },
    }

    expect(row_getPinnedIndex(table.getRow('0'))).toBe(0)
    expect(row_getPinnedIndex(table.getRow('1'))).toBe(1)
    expect(row_getPinnedIndex(table.getRow('2'))).toBe(2)
  })

  it('should handle undefined state', () => {
    const table = generateTestTableWithData(10)
    table.options.state = undefined

    const row = table.getRow('0')
    expect(row_getPinnedIndex(row)).toBe(-1)
  })
})

describe('row_pin', () => {
  it('should pin a row to top', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    const row = table.getRow('0')

    row_pin(row, 'top')

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, { top: [], bottom: [] }),
    ).toEqual({
      top: [ROW[0]],
      bottom: [],
    })
  })

  it('should pin a row to bottom', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    const row = table.getRow('0')

    row_pin(row, 'bottom')

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, { top: [], bottom: [] }),
    ).toEqual({
      top: [],
      bottom: [ROW[0]],
    })
  })

  it('should unpin a row when position is false', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    table.options.state = {
      rowPinning: {
        top: [ROW[0]],
        bottom: [],
      },
    }
    const row = table.getRow('0')

    row_pin(row, false)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, { top: [ROW[0]], bottom: [] }),
    ).toEqual({
      top: [],
      bottom: [],
    })
  })

  it('should include leaf rows when includeLeafRows is true', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    const row = table.getRow('0')
    const leafRows = [{ id: LEAF[1] }, { id: LEAF[2] }]
    vi.spyOn(row, 'getLeafRows').mockReturnValue(
      leafRows as unknown as Array<Row<any, Person>>,
    )

    row_pin(row, 'top', true)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, { top: [], bottom: [] }),
    ).toEqual({
      top: [ROW[0], LEAF[1], LEAF[2]],
      bottom: [],
    })
  })

  it('should include parent rows when includeParentRows is true', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    const row = table.getRow('0')
    const parentRows = [{ id: PARENT[1] }, { id: PARENT[2] }]
    vi.spyOn(row, 'getParentRows').mockReturnValue(
      parentRows as unknown as Array<Row<any, Person>>,
    )

    row_pin(row, 'top', false, true)

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, { top: [], bottom: [] }),
    ).toEqual({
      top: [PARENT[1], PARENT[2], ROW[0]],
      bottom: [],
    })
  })

  it('should maintain existing pinned rows when pinning additional rows', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    table.options.state = {
      rowPinning: {
        top: [ROW[1]],
        bottom: [ROW[2]],
      },
    }
    const row = table.getRow('0')

    row_pin(row, 'top')

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, {
        top: [ROW[1]],
        bottom: [ROW[2]],
      }),
    ).toEqual({
      top: [ROW[1], ROW[0]],
      bottom: [ROW[2]],
    })
  })

  it('should remove row from other position when moving between top and bottom', () => {
    const { table, onRowPinningChangeMock } =
      createTableWithMockOnPinningChange()
    table.options.state = {
      rowPinning: {
        top: [ROW[0]],
        bottom: [],
      },
    }
    const row = table.getRow('0')

    row_pin(row, 'bottom')

    expect(onRowPinningChangeMock).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onRowPinningChangeMock, { top: [ROW[0]], bottom: [] }),
    ).toEqual({
      top: [],
      bottom: [ROW[0]],
    })
  })
})
