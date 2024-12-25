import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnResizingState,
  header_getResizeHandler,
  isTouchStartEvent,
  passiveEventSupported,
  table_resetHeaderSizeInfo,
  table_setColumnResizing,
} from '../../../../src'
import { generateTestTableWithData } from '../../../helpers/generateTestTable'

// Add type for the features we need
type TestFeatures = {
  columnResizingFeature: {}
  columnSizingFeature: {}
}

// Helper function to create a properly structured test header
function createTestResizeHeader(table: any, overrides = {}) {
  const baseColumn = {
    ...table.getAllColumns()[0],
    id: 'firstName',
    columnDef: {
      enableResizing: true,
    },
    table,
    getLeafColumns: () => [
      {
        ...table.getAllColumns()[0],
        id: 'firstName',
        columnDef: {
          enableResizing: true,
        },
      },
    ],
  }

  return {
    column: baseColumn,
    getLeafHeaders: () => [
      {
        column: baseColumn,
        getSize: () => 100,
        subHeaders: [],
      },
    ],
    subHeaders: [],
    getSize: () => 100,
    ...overrides,
  }
}

describe('getDefaultColumnResizingState', () => {
  it('should return default column resizing state', () => {
    const result = getDefaultColumnResizingState()
    expect(result).toEqual({
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      columnSizingStart: [],
    })
  })
})

describe('column_getCanResize', () => {
  it('should return true when column resizing is enabled', () => {
    const table = generateTestTableWithData(1)
    const column = {
      ...table.getAllColumns()[0],
      columnDef: {},
      table,
    }

    const result = column_getCanResize(column as any)

    expect(result).toBe(true)
  })

  it('should return false when column resizing is disabled globally', () => {
    const table = generateTestTableWithData(1, {
      enableColumnResizing: false,
    })
    const column = {
      ...table.getAllColumns()[0],
      columnDef: {},
      table,
    }

    const result = column_getCanResize(column as any)

    expect(result).toBe(false)
  })

  it('should return false when column resizing is disabled for specific column', () => {
    const table = generateTestTableWithData(1)
    const column = {
      ...table.getAllColumns()[0],
      columnDef: { enableResizing: false },
      table,
    }

    const result = column_getCanResize(column as any)

    expect(result).toBe(false)
  })
})

describe('column_getIsResizing', () => {
  it('should return true when column is being resized', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnResizing: {
          isResizingColumn: 'firstName',
          columnSizingStart: [],
          deltaOffset: null,
          deltaPercentage: null,
          startOffset: null,
          startSize: null,
        },
      },
    })
    const column = {
      ...table.getAllColumns()[0],
      id: 'firstName',
      table,
    }

    const result = column_getIsResizing(column as any)

    expect(result).toBe(true)
  })

  it('should return false when column is not being resized', () => {
    const table = generateTestTableWithData(1)
    const column = {
      ...table.getAllColumns()[0],
      table,
    }

    const result = column_getIsResizing(column as any)

    expect(result).toBe(false)
  })
})

describe('table_setColumnResizing', () => {
  it('should call onColumnResizingChange with updater', () => {
    const onColumnResizingChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnResizingChange,
    })

    const newState = {
      startOffset: 100,
      startSize: 200,
      deltaOffset: 50,
      deltaPercentage: 0.25,
      isResizingColumn: 'firstName',
      columnSizingStart: [],
    }

    table_setColumnResizing(table, newState)

    expect(onColumnResizingChange).toHaveBeenCalledWith(newState)
  })
})

describe('table_resetHeaderSizeInfo', () => {
  it('should reset to default state when defaultState is true', () => {
    const onColumnResizingChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnResizingChange,
    })

    table_resetHeaderSizeInfo(table, true)

    expect(onColumnResizingChange).toHaveBeenCalledWith(
      getDefaultColumnResizingState(),
    )
  })

  it('should reset to initial state when defaultState is false', () => {
    const initialState = {
      columnResizing: {
        startOffset: 100,
        startSize: 200,
        deltaOffset: 50,
        deltaPercentage: 0.25,
        isResizingColumn: 'firstName',
        columnSizingStart: [],
      },
    }
    const onColumnResizingChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnResizingChange,
      initialState,
    })

    table_resetHeaderSizeInfo(table, false)

    expect(onColumnResizingChange).toHaveBeenCalledWith(
      initialState.columnResizing,
    )
  })
})

describe('isTouchStartEvent', () => {
  it('should return true for touch start events', () => {
    const event = { type: 'touchstart' }

    const result = isTouchStartEvent(event)

    expect(result).toBe(true)
  })

  it('should return false for non-touch start events', () => {
    const event = { type: 'mousedown' }

    const result = isTouchStartEvent(event)

    expect(result).toBe(false)
  })
})

describe('header_getResizeHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a function', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnSizing: {},
      },
    })
    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any)
    expect(typeof handler).toBe('function')
  })

  it('should not resize when column resizing is disabled', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      enableColumnResizing: false,
    })
    const onColumnResizingChange = vi.fn()
    table.options.onColumnResizingChange = onColumnResizingChange

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any)
    handler({ type: 'mousedown', clientX: 100 })

    expect(onColumnResizingChange).not.toHaveBeenCalled()
  })

  it('should ignore multi-touch events', () => {
    const table = generateTestTableWithData<TestFeatures>(1)
    const onColumnResizingChange = vi.fn()
    table.options.onColumnResizingChange = onColumnResizingChange

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any)
    handler({
      type: 'touchstart',
      touches: [{ clientX: 100 }, { clientX: 200 }],
    })

    expect(onColumnResizingChange).not.toHaveBeenCalled()
  })

  it('should update immediately in onChange mode', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      columnResizeMode: 'onChange',
    })
    const onColumnSizingChange = vi.fn()
    table.options.onColumnSizingChange = onColumnSizingChange

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any)
    handler({ type: 'mousedown', clientX: 100 })

    // Simulate mouse move
    const moveEvent = new MouseEvent('mousemove', { clientX: 150 })
    document.dispatchEvent(moveEvent)

    expect(onColumnSizingChange).toHaveBeenCalled()
  })

  it('should cleanup event listeners on mouse up', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const table = generateTestTableWithData<TestFeatures>(1)

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    // Clear the spy calls from setup
    removeEventListenerSpy.mockClear()

    // Simulate mouse up
    const upEvent = new MouseEvent('mouseup', { clientX: 150 })
    document.dispatchEvent(upEvent)

    // Should remove mousemove and mouseup listeners
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(4)
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
    )

    removeEventListenerSpy.mockRestore()
  })
})

describe('passiveEventSupported', () => {
  it('should return boolean indicating passive event support', () => {
    const result = passiveEventSupported()
    expect(typeof result).toBe('boolean')
  })

  it('should cache the result of passive support check', () => {
    const firstResult = passiveEventSupported()
    const secondResult = passiveEventSupported()
    expect(firstResult).toBe(secondResult)
  })

  it('should handle errors during support check', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    addEventListenerSpy.mockImplementation(() => {
      throw new Error('Test error')
    })

    const result = passiveEventSupported()
    expect(result).toBe(false)

    addEventListenerSpy.mockRestore()
  })
})
