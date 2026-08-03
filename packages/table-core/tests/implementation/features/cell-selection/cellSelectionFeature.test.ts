import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cellSelectionFeature,
  columnVisibilityFeature,
  constructTable,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { CellSelectionState, ColumnDef, Table } from '../../../../src'

const features = testFeatures({
  cellSelectionFeature,
  columnVisibilityFeature,
})

interface TestRow {
  id: string
  a: number
  b: number
  c: number
}

function makeData(count = 4): Array<TestRow> {
  return Array.from({ length: count }, (_, index) => ({
    id: `r${index}`,
    a: index * 10,
    b: index * 10 + 1,
    c: index * 10 + 2,
  }))
}

const columns: Array<ColumnDef<typeof features, TestRow>> = [
  { id: 'a', accessorKey: 'a' },
  { id: 'b', accessorKey: 'b' },
  { id: 'c', accessorKey: 'c' },
]

function makeTable(
  overrides: Record<string, unknown> = {},
): Table<typeof features, TestRow> {
  return constructTable<typeof features, TestRow>({
    features,
    data: makeData(),
    columns,
    getRowId: (row) => row.id,
    renderFallbackValue: '',
    ...overrides,
  })
}

function getCell(
  table: Table<typeof features, TestRow>,
  rowId: string,
  columnId: string,
) {
  return table.getRowModel().rowsById[rowId]!.getAllCellsByColumnId()[columnId]!
}

function rangeOf(
  anchorRowId: string,
  anchorColumnId: string,
  focusRowId: string,
  focusColumnId: string,
) {
  return { anchorRowId, anchorColumnId, focusRowId, focusColumnId }
}

/**
 * Minimal document stand-in so handler tests can drive the document-level
 * `mouseup` deterministically and assert that the listener is removed.
 */
function makeFakeDocument() {
  const listeners: Record<string, Array<() => void>> = {}

  return {
    document: {
      addEventListener: (type: string, fn: () => void) => {
        ;(listeners[type] ??= []).push(fn)
      },
      removeEventListener: (type: string, fn: () => void) => {
        listeners[type] = (listeners[type] ?? []).filter((l) => l !== fn)
      },
    } as unknown as Document,
    fire: (type: string) => {
      ;[...(listeners[type] ?? [])].forEach((fn) => fn())
    },
    count: (type: string) => (listeners[type] ?? []).length,
  }
}

describe('cellSelectionFeature', () => {
  describe('state', () => {
    it('defaults to an empty selection', () => {
      const table = makeTable()

      expect(table.atoms.cellSelection.get()).toEqual([])
    })

    it('respects initialState', () => {
      const table = makeTable({
        initialState: {
          cellSelection: [rangeOf('r0', 'a', 'r1', 'b')],
        },
      })

      expect(table.getSelectedCellCount()).toBe(4)
    })

    it('setCellSelection accepts a value and an updater', () => {
      const table = makeTable()

      table.setCellSelection([rangeOf('r0', 'a', 'r0', 'a')])
      expect(table.atoms.cellSelection.get()).toHaveLength(1)

      table.setCellSelection(() => [])
      expect(table.atoms.cellSelection.get()).toHaveLength(0)
    })

    it('resetCellSelection restores initial state, or clears with true', () => {
      const table = makeTable({
        initialState: {
          cellSelection: [rangeOf('r0', 'a', 'r0', 'a')],
        },
      })

      table.selectCellRange(rangeOf('r1', 'b', 'r2', 'c'))
      expect(table.getSelectedCellCount()).toBe(4)

      table.resetCellSelection()
      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r0', 'a'),
      ])

      table.resetCellSelection(true)
      expect(table.atoms.cellSelection.get()).toEqual([])
    })

    it('routes writes through onCellSelectionChange when provided', () => {
      const seen: Array<CellSelectionState> = []
      let state: CellSelectionState = []

      let table: Table<typeof features, TestRow>
      table = makeTable({
        state: { cellSelection: state },
        onCellSelectionChange: (updater: any) => {
          state = typeof updater === 'function' ? updater(state) : updater
          table.setOptions((prev) => ({
            ...prev,
            state: { ...prev.state, cellSelection: state },
          }))
          seen.push(state)
        },
      })

      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      expect(seen).toHaveLength(1)
      expect(seen[0]!).toEqual([rangeOf('r0', 'a', 'r1', 'b')])
      expect(table.atoms.cellSelection.get()).toEqual(seen[0])
    })
  })

  describe('autoResetCellSelection', () => {
    // the reset is scheduled, and the core row model recomputes lazily, so
    // read the model to trigger it and flush the microtask queue
    async function changeData(table: Table<typeof features, TestRow>) {
      table.setOptions((prev: any) => ({ ...prev, data: makeData() }))
      table.getCoreRowModel()
      await Promise.resolve()
    }

    it('clears ranges when data changes', async () => {
      const table = makeTable()
      table.getCoreRowModel()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))
      expect(table.getSelectedCellCount()).toBe(4)

      await changeData(table)

      expect(table.atoms.cellSelection.get()).toEqual([])
    })

    it('resets to initialState rather than to empty', async () => {
      const table = makeTable({
        initialState: {
          cellSelection: [rangeOf('r0', 'a', 'r0', 'a')],
        },
      })
      table.getCoreRowModel()
      table.selectCellRange(rangeOf('r1', 'b', 'r2', 'c'))

      await changeData(table)

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r0', 'a'),
      ])
    })

    it('does not clear an existing selection on first read', async () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      // the very first core row model computation also fires onAfterUpdate
      table.getCoreRowModel()
      await Promise.resolve()

      expect(table.getSelectedCellCount()).toBe(4)
    })

    it('can be disabled', async () => {
      const table = makeTable({ autoResetCellSelection: false })
      table.getCoreRowModel()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      await changeData(table)

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r1', 'b'),
      ])
    })

    it('is overridden by autoResetAll', async () => {
      const table = makeTable({
        autoResetAll: false,
        autoResetCellSelection: true,
      })
      table.getCoreRowModel()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      await changeData(table)

      expect(table.atoms.cellSelection.get()).toHaveLength(1)
    })
  })

  describe('cell.getCanSelect', () => {
    it('defaults to true', () => {
      const table = makeTable()
      expect(getCell(table, 'r0', 'a').getCanSelect()).toBe(true)
    })

    it('honors the table-level boolean', () => {
      const table = makeTable({ enableCellSelection: false })
      expect(getCell(table, 'r0', 'a').getCanSelect()).toBe(false)
    })

    it('honors a per-cell predicate', () => {
      const table = makeTable({
        enableCellSelection: (cell: any) => cell.row.id !== 'r1',
      })

      expect(getCell(table, 'r0', 'a').getCanSelect()).toBe(true)
      expect(getCell(table, 'r1', 'a').getCanSelect()).toBe(false)
    })

    it('lets a column def opt out', () => {
      const table = makeTable({
        columns: [
          { id: 'a', accessorKey: 'a' },
          { id: 'b', accessorKey: 'b', enableCellSelection: false },
          { id: 'c', accessorKey: 'c' },
        ],
      })

      expect(getCell(table, 'r0', 'a').getCanSelect()).toBe(true)
      expect(getCell(table, 'r0', 'b').getCanSelect()).toBe(false)
    })
  })

  describe('cell.getIsSelected', () => {
    let table: Table<typeof features, TestRow>

    beforeEach(() => {
      table = makeTable()
      table.selectCellRange(rangeOf('r1', 'a', 'r2', 'b'))
    })

    it('covers the inclusive rectangle', () => {
      expect(getCell(table, 'r1', 'a').getIsSelected()).toBe(true)
      expect(getCell(table, 'r1', 'b').getIsSelected()).toBe(true)
      expect(getCell(table, 'r2', 'a').getIsSelected()).toBe(true)
      expect(getCell(table, 'r2', 'b').getIsSelected()).toBe(true)
    })

    it('excludes cells outside the rectangle', () => {
      expect(getCell(table, 'r0', 'a').getIsSelected()).toBe(false)
      expect(getCell(table, 'r3', 'a').getIsSelected()).toBe(false)
      expect(getCell(table, 'r1', 'c').getIsSelected()).toBe(false)
    })

    it('normalizes a range dragged up and to the left', () => {
      table.selectCellRange(rangeOf('r2', 'b', 'r1', 'a'))

      expect(getCell(table, 'r1', 'a').getIsSelected()).toBe(true)
      expect(getCell(table, 'r2', 'b').getIsSelected()).toBe(true)
    })

    it('excludes cells in an opted-out column inside the rectangle', () => {
      const opted = makeTable({
        columns: [
          { id: 'a', accessorKey: 'a' },
          { id: 'b', accessorKey: 'b', enableCellSelection: false },
          { id: 'c', accessorKey: 'c' },
        ],
      })
      opted.selectCellRange(rangeOf('r0', 'a', 'r1', 'c'))

      expect(getCell(opted, 'r0', 'a').getIsSelected()).toBe(true)
      expect(getCell(opted, 'r0', 'b').getIsSelected()).toBe(false)
      expect(getCell(opted, 'r0', 'c').getIsSelected()).toBe(true)
    })
  })

  describe('focus', () => {
    it('derives the focused cell from the active range anchor', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r1', 'b', 'r3', 'c'))

      expect(table.getFocusedCell()?.id).toBe('r1_b')
      expect(getCell(table, 'r1', 'b').getIsFocused()).toBe(true)
      // the moving corner is not the active cell
      expect(getCell(table, 'r3', 'c').getIsFocused()).toBe(false)
    })

    it('is undefined with nothing selected', () => {
      expect(makeTable().getFocusedCell()).toBeUndefined()
    })

    it('drives roving tabindex', () => {
      const table = makeTable()
      table.setFocusedCell('r2', 'c')

      expect(getCell(table, 'r2', 'c').getTabIndex()).toBe(0)
      expect(getCell(table, 'r0', 'a').getTabIndex()).toBe(-1)
    })

    it('setFocusedCell collapses the selection to one cell', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r3', 'c'))
      table.setFocusedCell('r1', 'b')

      expect(table.getSelectedCellCount()).toBe(1)
      expect(table.getSelectedCellIds()).toEqual(['r1_b'])
    })
  })

  describe('cell.getSelectionEdges', () => {
    it('reports all four sides for a single-cell selection', () => {
      const table = makeTable()
      table.setFocusedCell('r1', 'b')

      expect(getCell(table, 'r1', 'b').getSelectionEdges()).toEqual({
        top: true,
        right: true,
        bottom: true,
        left: true,
      })
    })

    it('reports only outer sides inside a larger rectangle', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'c'))

      expect(getCell(table, 'r0', 'a').getSelectionEdges()).toEqual({
        top: true,
        right: false,
        bottom: false,
        left: true,
      })
      expect(getCell(table, 'r1', 'b').getSelectionEdges()).toEqual({
        top: false,
        right: false,
        bottom: false,
        left: false,
      })
      expect(getCell(table, 'r2', 'c').getSelectionEdges()).toEqual({
        top: false,
        right: true,
        bottom: true,
        left: false,
      })
    })

    it('reports no edges for an unselected cell', () => {
      const table = makeTable()

      expect(getCell(table, 'r0', 'a').getSelectionEdges()).toEqual({
        top: false,
        right: false,
        bottom: false,
        left: false,
      })
    })
  })

  describe('navigation', () => {
    it('moveCellSelection seeds the first cell when nothing is selected', () => {
      const table = makeTable()
      table.moveCellSelection('down')

      expect(table.getSelectedCellIds()).toEqual(['r0_a'])
    })

    it('moveCellSelection collapses to a single moved cell', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'c'))
      table.moveCellSelection('down')

      expect(table.getSelectedCellIds()).toEqual(['r1_a'])
    })

    it('moveCellSelection stops at the grid edges', () => {
      const table = makeTable()
      table.setFocusedCell('r0', 'a')

      table.moveCellSelection('up')
      expect(table.getSelectedCellIds()).toEqual(['r0_a'])

      table.moveCellSelection('left')
      expect(table.getSelectedCellIds()).toEqual(['r0_a'])
    })

    it('moveCellSelection skips over opted-out columns', () => {
      const table = makeTable({
        columns: [
          { id: 'a', accessorKey: 'a' },
          { id: 'b', accessorKey: 'b', enableCellSelection: false },
          { id: 'c', accessorKey: 'c' },
        ],
      })
      table.setFocusedCell('r0', 'a')
      table.moveCellSelection('right')

      expect(table.getSelectedCellIds()).toEqual(['r0_c'])
    })

    it('recovers navigation from an opted-out anchor column', () => {
      const table = makeTable({
        columns: [
          { id: 'a', accessorKey: 'a' },
          { id: 'b', accessorKey: 'b', enableCellSelection: false },
          { id: 'c', accessorKey: 'c' },
        ],
      })

      table.setFocusedCell('r0', 'b')
      table.moveCellSelection('right')
      expect(table.getSelectedCellIds()).toEqual(['r0_c'])

      table.setFocusedCell('r0', 'b')
      table.moveCellSelection('left')
      expect(table.getSelectedCellIds()).toEqual(['r0_a'])

      table.setFocusedCell('r0', 'b')
      table.moveCellSelection('down')
      expect(table.getSelectedCellIds()).toEqual(['r1_a'])
    })

    it('extendCellSelection moves the focus and keeps the anchor', () => {
      const table = makeTable()
      table.setFocusedCell('r1', 'a')
      table.extendCellSelection('down')
      table.extendCellSelection('right')

      const [range] = table.atoms.cellSelection.get()
      expect(range).toEqual(rangeOf('r1', 'a', 'r2', 'b'))
      expect(table.getSelectedCellCount()).toBe(4)
    })

    it('extendCellSelection stops at the grid edges', () => {
      const table = makeTable()
      table.setFocusedCell('r0', 'a')
      table.extendCellSelection('up')

      expect(table.getSelectedCellCount()).toBe(1)
    })
  })

  describe('derived data', () => {
    it('getSelectedCellIds lists ids in row-major order', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      expect(table.getSelectedCellIds()).toEqual([
        'r0_a',
        'r0_b',
        'r1_a',
        'r1_b',
      ])
    })

    it('getSelectedCellCount uses rectangle arithmetic', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r3', 'c'))

      expect(table.getSelectedCellCount()).toBe(12)
    })

    it('getSelectedCellCount falls back to enumeration for a predicate', () => {
      const table = makeTable({
        enableCellSelection: (cell: any) => cell.row.id !== 'r1',
      })
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'c'))

      // 2 rows x 3 columns, minus the whole of r1
      expect(table.getSelectedCellCount()).toBe(3)
    })

    it('returns no selected cells when selection is disabled', () => {
      const table = makeTable({
        enableCellSelection: false,
        initialState: {
          cellSelection: [rangeOf('r0', 'a', 'r1', 'b')],
        },
      })

      expect(table.getSelectedCellIds()).toEqual([])
      expect(table.getSelectedCellCount()).toBe(0)
      expect(table.getSelectedCellRangesData()).toEqual([])
    })

    it('recomputes derivations when the selection predicate changes', () => {
      const table = makeTable({
        enableCellSelection: () => true,
      })
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      expect(table.getSelectedCellCount()).toBe(4)
      expect(table.getSelectedCellIds()).toHaveLength(4)

      table.setOptions((prev) => ({
        ...prev,
        enableCellSelection: () => false,
      }))

      expect(table.getSelectedCellCount()).toBe(0)
      expect(table.getSelectedCellIds()).toEqual([])
      expect(table.getSelectedCellRangesData()).toEqual([])
    })

    it('getSelectedCellRangesData returns a row-major grid per range', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r1', 'b'))

      expect(table.getSelectedCellRangesData()).toEqual([
        [
          [0, 1],
          [10, 11],
        ],
      ])
    })

    it('getSelectedCellRangesData keeps ranges separate', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r0', 'a', 'r0', 'b'))
      table.selectCellRange(rangeOf('r2', 'b', 'r2', 'c'), { additive: true })

      // one grid per range, so userland serializers can decide how to join them
      expect(table.getSelectedCellRangesData()).toEqual([[[0, 1]], [[21, 22]]])
    })

    it('getCellSelectionRowIds and ColumnIds report intersections', () => {
      const table = makeTable()
      table.selectCellRange(rangeOf('r1', 'b', 'r2', 'c'))

      expect(table.getCellSelectionRowIds()).toEqual(['r1', 'r2'])
      expect(table.getCellSelectionColumnIds()).toEqual(['b', 'c'])
    })

    it('returns empty derivations with nothing selected', () => {
      const table = makeTable()

      expect(table.getSelectedCellIds()).toEqual([])
      expect(table.getSelectedCellCount()).toBe(0)
      expect(table.getSelectedCellRangesData()).toEqual([])
      expect(table.getCellSelectionRowIds()).toEqual([])
      expect(table.getCellSelectionColumnIds()).toEqual([])
    })
  })

  describe('selectAllCells', () => {
    it('selects the whole grid as one range', () => {
      const table = makeTable()
      table.selectAllCells()

      expect(table.getSelectedCellCount()).toBe(12)
      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r3', 'c'),
      ])
    })

    it('spans only selectable columns', () => {
      const table = makeTable({
        columns: [
          { id: 'a', accessorKey: 'a' },
          { id: 'b', accessorKey: 'b' },
          { id: 'c', accessorKey: 'c', enableCellSelection: false },
        ],
      })
      table.selectAllCells()

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r3', 'b'),
      ])
    })

    it('does nothing when selection is disabled', () => {
      const table = makeTable({ enableCellSelection: false })
      table.selectAllCells()

      expect(table.atoms.cellSelection.get()).toEqual([])
    })
  })

  describe('handlers', () => {
    it('mousedown selects a single cell and opens a drag', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r1', 'b').getSelectionStartHandler(fake.document)({})

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r1', 'b', 'r1', 'b'),
      ])
      // the drag flag is instance data, deliberately not part of the slice
      expect(table._isSelectingCells).toBe(true)
    })

    it('document mouseup ends the drag and removes its listener', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r1', 'b').getSelectionStartHandler(fake.document)({})
      expect(fake.count('mouseup')).toBe(1)

      fake.fire('mouseup')

      expect(table._isSelectingCells).toBe(false)
      expect(fake.count('mouseup')).toBe(0)
    })

    it('mouseenter extends the active range while dragging', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      getCell(table, 'r2', 'c').getSelectionExtendHandler()({})

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r2', 'c'),
      ])
      expect(table.getSelectedCellCount()).toBe(9)
    })

    it('a rehydrated selection cannot resume a drag it never started', () => {
      // the whole reason the drag flag is instance data: a selection persisted
      // to a URL or storage mid-drag must not rehydrate into a stuck drag
      const table = makeTable({
        initialState: { cellSelection: [rangeOf('r0', 'a', 'r0', 'a')] },
      })

      expect(table._isSelectingCells).toBe(false)

      getCell(table, 'r2', 'c').getSelectionExtendHandler()({})

      expect(table.getSelectedCellCount()).toBe(1)
    })

    it('mouseenter is a no-op when no drag is in progress', () => {
      const table = makeTable()
      table.setFocusedCell('r0', 'a')

      getCell(table, 'r2', 'c').getSelectionExtendHandler()({})

      expect(table.getSelectedCellCount()).toBe(1)
    })

    it('mouseenter on the already-focused cell writes nothing', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      const before = table.atoms.cellSelection.get()

      getCell(table, 'r0', 'a').getSelectionExtendHandler()({})

      expect(table.atoms.cellSelection.get()).toBe(before)
    })

    it('shift-mousedown extends from the existing anchor', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      fake.fire('mouseup')
      getCell(table, 'r2', 'b').getSelectionStartHandler(fake.document)({
        shiftKey: true,
      })

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r2', 'b'),
      ])
    })

    it('reads the modifier off a framework nativeEvent too', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      fake.fire('mouseup')
      getCell(table, 'r1', 'a').getSelectionStartHandler(fake.document)({
        nativeEvent: { shiftKey: true },
      })

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r1', 'a'),
      ])
    })

    it('ctrl-mousedown adds a second disjoint rectangle', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      fake.fire('mouseup')
      getCell(table, 'r3', 'c').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r0', 'a'),
        rangeOf('r3', 'c', 'r3', 'c'),
      ])
      expect(table.getSelectedCellCount()).toBe(2)
    })

    it('ctrl-mousedown on a selected cell subtracts it', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'c'))
      getCell(table, 'r1', 'b').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r0', 'a', 'r2', 'c'),
        { ...rangeOf('r1', 'b', 'r1', 'b'), operation: 'exclude' },
      ])
      expect(table.getSelectedCellCount()).toBe(8)
      expect(getCell(table, 'r1', 'b').getIsSelected()).toBe(false)
      expect(getCell(table, 'r1', 'b').getIsFocused()).toBe(true)
    })

    it('ctrl-drag subtracts cells and shrinking the drag restores them', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'c'))
      getCell(table, 'r1', 'a').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })
      getCell(table, 'r1', 'c').getSelectionExtendHandler()({})
      expect(table.getSelectedCellCount()).toBe(6)

      getCell(table, 'r1', 'b').getSelectionExtendHandler()({})
      expect(table.getSelectedCellCount()).toBe(7)
      expect(table.atoms.cellSelection.get().at(-1)).toEqual({
        ...rangeOf('r1', 'a', 'r1', 'b'),
        operation: 'exclude',
      })
    })

    it('shift and keyboard extension preserve an active exclusion', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'c'))
      getCell(table, 'r1', 'a').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })
      fake.fire('mouseup')
      getCell(table, 'r1', 'b').getSelectionStartHandler(fake.document)({
        shiftKey: true,
      })

      expect(table.getSelectedCellCount()).toBe(7)
      expect(table.atoms.cellSelection.get().at(-1)).toEqual({
        ...rangeOf('r1', 'a', 'r1', 'b'),
        operation: 'exclude',
      })

      table.extendCellSelection('right')

      expect(table.getSelectedCellCount()).toBe(6)
      expect(table.atoms.cellSelection.get().at(-1)).toEqual({
        ...rangeOf('r1', 'a', 'r1', 'c'),
        operation: 'exclude',
      })
    })

    it('ctrl-drag beginning on an unselected cell only includes the rectangle', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      table.selectCellRange(rangeOf('r0', 'a', 'r0', 'a'))
      getCell(table, 'r1', 'b').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })
      getCell(table, 'r2', 'c').getSelectionExtendHandler()({})

      expect(table.getSelectedCellIds()).toEqual([
        'r0_a',
        'r1_b',
        'r1_c',
        'r2_b',
        'r2_c',
      ])
      expect(table.atoms.cellSelection.get().at(-1)?.operation).toBeUndefined()
    })

    it('ignores subtractive modifiers when multi-range selection is disabled', () => {
      const table = makeTable({ enableMultiCellRangeSelection: false })
      const fake = makeFakeDocument()

      table.selectCellRange(rangeOf('r0', 'a', 'r2', 'c'))
      getCell(table, 'r1', 'b').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r1', 'b', 'r1', 'b'),
      ])
      expect(table.getSelectedCellCount()).toBe(1)
    })

    it('metaKey works for multi-range as well', () => {
      const table = makeTable()
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      fake.fire('mouseup')
      getCell(table, 'r3', 'c').getSelectionStartHandler(fake.document)({
        metaKey: true,
      })

      expect(table.atoms.cellSelection.get()).toHaveLength(2)
    })

    it('does nothing for a cell that cannot be selected', () => {
      const table = makeTable({ enableCellSelection: false })
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})

      expect(table.atoms.cellSelection.get()).toEqual([])
      expect(fake.count('mouseup')).toBe(0)
    })

    it('skips drag bookkeeping when drag is disabled', () => {
      const table = makeTable({ enableCellSelectionDrag: false })
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})

      expect(table._isSelectingCells).toBe(false)
      expect(fake.count('mouseup')).toBe(0)
    })

    it('does not open a drag without a document to close it', () => {
      const table = makeTable()

      vi.stubGlobal('document', undefined)
      try {
        getCell(table, 'r0', 'a').getSelectionStartHandler()({})
      } finally {
        vi.unstubAllGlobals()
      }

      expect(table._isSelectingCells).toBe(false)
      expect(table.getSelectedCellIds()).toEqual(['r0_a'])
    })

    it('ignores shift when range selection is disabled', () => {
      const table = makeTable({ enableCellRangeSelection: false })
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      getCell(table, 'r2', 'b').getSelectionStartHandler(fake.document)({
        shiftKey: true,
      })

      expect(table.atoms.cellSelection.get()).toEqual([
        rangeOf('r2', 'b', 'r2', 'b'),
      ])
    })

    it('ignores ctrl when multi-range is disabled', () => {
      const table = makeTable({ enableMultiCellRangeSelection: false })
      const fake = makeFakeDocument()

      getCell(table, 'r0', 'a').getSelectionStartHandler(fake.document)({})
      fake.fire('mouseup')
      getCell(table, 'r3', 'c').getSelectionStartHandler(fake.document)({
        ctrlKey: true,
      })

      expect(table.atoms.cellSelection.get()).toHaveLength(1)
    })
  })
})
