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
} from '../../../../src/static-functions'
import {
  columnResizingFeature,
  columnSizingFeature,
  constructTable,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { ColumnDef, Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  columnResizingFeature,
  columnSizingFeature,
})

function makeTable(
  rowCount: number,
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Person> {
  const data = generateTestData(rowCount)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    ...options,
  })
}

// Helper function to create a properly structured test header. The assertions
// below encode this fake's geometry (getSize: () => 100), so it stays a
// synthetic object rather than a real header.
function createTestResizeHeader(
  table: Table<typeof features, Person>,
  overrides = {},
) {
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
    table,
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
    const table = makeTable(1)
    const column = table.getAllColumns()[0]!

    const result = column_getCanResize(column)

    expect(result).toBe(true)
  })

  it('should return false when column resizing is disabled globally', () => {
    const table = makeTable(1, {
      enableColumnResizing: false,
    })
    const column = table.getAllColumns()[0]!

    const result = column_getCanResize(column)

    expect(result).toBe(false)
  })

  it('should return false when column resizing is disabled for specific column', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', enableResizing: false },
    ]
    const table = constructTable({
      features,
      data: generateTestData(1),
      columns,
    })
    const column = table.getAllColumns()[0]!

    const result = column_getCanResize(column)

    expect(result).toBe(false)
  })
})

describe('column_getIsResizing', () => {
  it('should return true when column is being resized', () => {
    const table = makeTable(1, {
      initialState: {
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
    const column = table.getColumn('firstName')!

    const result = column_getIsResizing(column)

    expect(result).toBe(true)
  })

  it('should return false when column is not being resized', () => {
    const table = makeTable(1)
    const column = table.getAllColumns()[0]!

    const result = column_getIsResizing(column)

    expect(result).toBe(false)
  })
})

describe('table_setColumnResizing', () => {
  it('should call onColumnResizingChange with updater', () => {
    const onColumnResizingChange = vi.fn()
    const table = makeTable(1, {
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
    const table = makeTable(1, {
      onColumnResizingChange,
      state: {
        columnResizing: {
          ...getDefaultColumnResizingState(),
          isResizingColumn: 'firstName',
        },
      },
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
    const table = makeTable(1, {
      onColumnResizingChange,
      initialState,
      state: { columnResizing: getDefaultColumnResizingState() },
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
    const table = makeTable(1, {
      initialState: {
        columnSizing: {},
      },
    })
    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any)
    expect(typeof handler).toBe('function')
  })

  it('should attach listeners to an explicit context document', () => {
    const table = makeTable(1)
    const header = createTestResizeHeader(table)
    const contextDocument = document.implementation.createHTMLDocument()
    const addEventListener = vi.spyOn(contextDocument, 'addEventListener')
    const handler = header_getResizeHandler(header as any, contextDocument)

    handler({ type: 'mousedown', clientX: 100 })

    expect(addEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
      expect.anything(),
    )
    expect(addEventListener).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
      expect.anything(),
    )
  })

  it('should not resize when column resizing is disabled', () => {
    const table = makeTable(1, {
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
    const table = makeTable(1)
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
    const table = makeTable(1, {
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

    const upEvent = new MouseEvent('mouseup', { clientX: 150 })
    document.dispatchEvent(upEvent)
  })

  it('should allow resizing a column from zero width', () => {
    const table = makeTable(1, {
      columnResizeMode: 'onChange',
    })

    let resizingState = getDefaultColumnResizingState()
    table.options.onColumnResizingChange = (updater) => {
      resizingState =
        typeof updater === 'function' ? updater(resizingState) : updater
      ;(table.store.state as any).columnResizing = resizingState
    }

    const sizingUpdates: Array<Record<string, number>> = []
    table.options.onColumnSizingChange = (updater) => {
      if (typeof updater === 'function') {
        const result = updater(table.atoms.columnSizing.get())
        sizingUpdates.push(result)
      } else {
        sizingUpdates.push(updater)
      }
    }

    const zeroSizeColumn = {
      ...table.getAllColumns()[0],
      id: 'firstName',
      columnDef: { enableResizing: true, minSize: 0, size: 0 },
      table,
    }
    const header = createTestResizeHeader(table, {
      getSize: () => 0,
      getLeafHeaders: () => [
        {
          column: zeroSizeColumn,
          getSize: () => 0,
          subHeaders: [],
        },
      ],
    })

    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    const moveEvent = new MouseEvent('mousemove', { clientX: 150 })
    document.dispatchEvent(moveEvent)

    const lastUpdate = sizingUpdates[sizingUpdates.length - 1]
    expect(lastUpdate).toBeDefined()
    const newSize = lastUpdate!['firstName']
    expect(newSize).toBeGreaterThan(0)
    expect(Number.isNaN(newSize)).toBe(false)

    const upEvent = new MouseEvent('mouseup', { clientX: 150 })
    document.dispatchEvent(upEvent)
  })

  it('should not produce NaN when startSize is zero', () => {
    const table = makeTable(1, {
      columnResizeMode: 'onChange',
    })

    let resizingState = getDefaultColumnResizingState()
    const resizingUpdates: Array<typeof resizingState> = []
    table.options.onColumnResizingChange = (updater) => {
      resizingState =
        typeof updater === 'function' ? updater(resizingState) : updater
      ;(table.store.state as any).columnResizing = resizingState
      resizingUpdates.push(resizingState)
    }

    const zeroSizeColumn = {
      ...table.getAllColumns()[0],
      id: 'firstName',
      columnDef: { enableResizing: true, minSize: 0, size: 0 },
      table,
    }
    const header = createTestResizeHeader(table, {
      getSize: () => 0,
      getLeafHeaders: () => [
        {
          column: zeroSizeColumn,
          getSize: () => 0,
          subHeaders: [],
        },
      ],
    })

    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    const moveEvent = new MouseEvent('mousemove', { clientX: 150 })
    document.dispatchEvent(moveEvent)

    const lastResizing = resizingUpdates[resizingUpdates.length - 1]
    expect(lastResizing).toBeDefined()
    expect(Number.isNaN(lastResizing!.deltaPercentage)).toBe(false)
    expect(Number.isFinite(lastResizing!.deltaPercentage)).toBe(true)

    const upEvent = new MouseEvent('mouseup', { clientX: 150 })
    document.dispatchEvent(upEvent)
  })

  it('should coalesce move events into one update per animation frame', () => {
    const rafCallbacks: Array<FrameRequestCallback> = []
    const rafSpy = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      })
    const cafSpy = vi
      .spyOn(globalThis, 'cancelAnimationFrame')
      .mockImplementation(() => {})

    const table = makeTable(1, {
      columnResizeMode: 'onChange',
    })
    const onColumnSizingChange = vi.fn()
    table.options.onColumnSizingChange = onColumnSizingChange

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110 }))
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120 }))
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 130 }))

    // leading edge applies immediately; later moves wait for the frame
    expect(onColumnSizingChange).toHaveBeenCalledTimes(1)

    // frame boundary flushes the latest coalesced move
    rafCallbacks.shift()!(0)
    expect(onColumnSizingChange).toHaveBeenCalledTimes(2)

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 130 }))

    rafSpy.mockRestore()
    cafSpy.mockRestore()
  })

  it('should cancel a pending coalesced move on mouse up and commit the end position', () => {
    const rafCallbacks: Array<FrameRequestCallback> = []
    const rafSpy = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      })
    const canceledIds: Array<number> = []
    const cafSpy = vi
      .spyOn(globalThis, 'cancelAnimationFrame')
      .mockImplementation((id) => {
        canceledIds.push(id)
      })

    const table = makeTable(1, {
      columnResizeMode: 'onChange',
    })
    const sizingUpdates: Array<Record<string, number>> = []
    table.options.onColumnSizingChange = (updater) => {
      sizingUpdates.push(
        typeof updater === 'function'
          ? updater(table.atoms.columnSizing.get())
          : updater,
      )
    }

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110 }))
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120 }))
    expect(sizingUpdates).toHaveLength(1)

    // mouseup before the frame fires: pending frame is canceled and the end
    // position is committed synchronously
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 150 }))
    expect(canceledIds).toHaveLength(1)
    expect(sizingUpdates).toHaveLength(2)
    // default size 150 at startOffset 100, so mouseup at 150 grows the
    // column by a third: 150 * (1 + 50/150) = 200
    expect(sizingUpdates[1]!['firstName']).toBe(200)

    rafSpy.mockRestore()
    cafSpy.mockRestore()
  })

  it('should flush one store notification per move tick and per drag end (batched writes)', () => {
    const table = makeTable(1, {
      columnResizeMode: 'onChange',
    })
    const notifications: Array<string> = []
    table.store.subscribe(() => notifications.push('flush'))

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })
    const afterDown = notifications.length

    // a move writes columnResizing AND columnSizing, batched into one flush
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150 }))
    const afterMove = notifications.length

    // drag end: 'end' commit (two writes) + resizing reset, one flush total
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 160 }))
    const afterUp = notifications.length

    expect(afterDown).toBe(1)
    expect(afterMove - afterDown).toBe(1)
    expect(afterUp - afterMove).toBe(1)
  })

  it('should not commit sizing on move ticks in onEnd mode, only at drag end', () => {
    const table = makeTable(1, {
      columnResizeMode: 'onEnd',
    })
    const sizingUpdates: Array<Record<string, number>> = []
    table.options.onColumnSizingChange = (updater) => {
      sizingUpdates.push(
        typeof updater === 'function'
          ? updater(table.atoms.columnSizing.get())
          : updater,
      )
    }

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    // single move: the rAF throttle applies the first move of a frame
    // immediately, later moves wait for the next frame
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 140 }))
    expect(sizingUpdates).toHaveLength(0)

    // transient resize info still tracks the drag during moves
    expect(table.atoms.columnResizing.get().deltaOffset).toBe(40)

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 150 }))
    expect(sizingUpdates).toHaveLength(1)
    // default size 150 at startOffset 100: 150 * (1 + 50/150) = 200
    expect(sizingUpdates[0]!['firstName']).toBe(200)
    expect(table.atoms.columnResizing.get().isResizingColumn).toBe(false)
  })

  it('should cleanup event listeners on mouse up', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const table = makeTable(1)

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'mousedown', clientX: 100 })

    // Clear the spy calls from setup
    removeEventListenerSpy.mockClear()

    // Simulate mouse up
    const upEvent = new MouseEvent('mouseup', { clientX: 150 })
    document.dispatchEvent(upEvent)

    // Should remove mousemove and mouseup listeners
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2)
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

  it('should cleanup event listeners and reset state on touchcancel', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const table = makeTable(1, {
      columnResizeMode: 'onChange',
    })
    const sizingUpdates: Array<Record<string, number>> = []
    table.options.onColumnSizingChange = (updater) => {
      sizingUpdates.push(
        typeof updater === 'function'
          ? updater(table.atoms.columnSizing.get())
          : updater,
      )
    }

    const header = createTestResizeHeader(table)
    const handler = header_getResizeHandler(header as any, document)
    handler({ type: 'touchstart', touches: [{ clientX: 100 }] })

    document.dispatchEvent(
      Object.assign(new Event('touchmove'), { touches: [{ clientX: 150 }] }),
    )
    expect(sizingUpdates).toHaveLength(1)

    removeEventListenerSpy.mockClear()
    document.dispatchEvent(new Event('touchcancel'))

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function),
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchcancel',
      expect.any(Function),
    )
    expect(table.atoms.columnResizing.get().isResizingColumn).toBe(false)

    // cancel commits at the last observed position, then moves are ignored
    const updatesAfterCancel = sizingUpdates.length
    document.dispatchEvent(
      Object.assign(new Event('touchmove'), { touches: [{ clientX: 300 }] }),
    )
    expect(sizingUpdates).toHaveLength(updatesAfterCancel)

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

  it('should handle errors during support check', async () => {
    // Reset modules so passiveEventSupported's cache starts fresh —
    // earlier tests in this describe block populate the module-level cache,
    // which would otherwise short-circuit before reaching the throwing spy.
    vi.resetModules()
    const { passiveEventSupported: freshPassiveEventSupported } =
      await import('../../../../src/features/column-resizing/columnResizingFeature.utils')

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    addEventListenerSpy.mockImplementation(() => {
      throw new Error('Test error')
    })

    const result = freshPassiveEventSupported()
    expect(result).toBe(false)

    addEventListenerSpy.mockRestore()
  })
})
