import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { createHotkeys } from '@tanstack/solid-hotkeys'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { CellContextMenu } from './CellContextMenu'
import { ColumnMenu } from './ColumnMenu'
import { getFillPreview } from './spreadsheetModel'
import type { JSX } from 'solid-js'
import type {
  CellSelectionRangeOperation,
  CellSelectionState,
} from '@tanstack/solid-table'
import type { VirtualItem } from '@tanstack/solid-virtual'
import type {
  FillPreview,
  GridBounds,
  GridCoordinate,
} from './spreadsheetModel'
import type {
  SpreadsheetTable,
  SpreadsheetTableCell,
  SpreadsheetTableColumn,
  SpreadsheetTableHeader,
  SpreadsheetTableRow,
} from './spreadsheetTable'
import type { GridInteractions } from './createGridInteractions'

export const ROW_HEIGHT = 24
export const HEADER_HEIGHT = 26
export const ROW_HEADER_WIDTH = 42
const CELL_HORIZONTAL_PADDING = 10
const EDGE_SCROLL_ZONE = 32
const MAX_EDGE_SCROLL_SPEED = 22

interface SpreadsheetGridProps {
  table: SpreadsheetTable
  interactions: GridInteractions
  zoom: number
  onReady: (handle: SpreadsheetGridHandle) => void
}

export interface SpreadsheetGridHandle {
  scrollToCell: (rowId: string, columnId: string) => void
}

interface OpenColumnMenu {
  column: SpreadsheetTableColumn
  rect: DOMRect
}

interface OpenCellMenu {
  x: number
  y: number
  column: SpreadsheetTableColumn
}

interface FillDrag {
  source: GridBounds
  preview: FillPreview | null
}

interface HeaderSelectionDrag {
  axis: 'column' | 'row'
  anchorId: string
  baseSelection: CellSelectionState
  operation: CellSelectionRangeOperation
}

export function SpreadsheetGrid(props: SpreadsheetGridProps) {
  const { table, interactions } = props
  let scrollRef: HTMLDivElement | undefined

  createHotkeys(
    [
      { hotkey: 'ArrowUp', callback: () => interactions.moveSelection('up') },
      {
        hotkey: 'ArrowDown',
        callback: () => interactions.moveSelection('down'),
      },
      {
        hotkey: 'ArrowLeft',
        callback: () => interactions.moveSelection('left'),
      },
      {
        hotkey: 'ArrowRight',
        callback: () => interactions.moveSelection('right'),
      },
      {
        hotkey: 'Shift+ArrowUp',
        callback: () => interactions.moveSelection('up', true),
      },
      {
        hotkey: 'Shift+ArrowDown',
        callback: () => interactions.moveSelection('down', true),
      },
      {
        hotkey: 'Shift+ArrowLeft',
        callback: () => interactions.moveSelection('left', true),
      },
      {
        hotkey: 'Shift+ArrowRight',
        callback: () => interactions.moveSelection('right', true),
      },
      { hotkey: 'Tab', callback: () => interactions.moveSelection('right') },
      {
        hotkey: 'Shift+Tab',
        callback: () => interactions.moveSelection('left'),
      },
      { hotkey: 'Enter', callback: () => interactions.moveSelection('down') },
      {
        hotkey: 'Shift+Enter',
        callback: () => interactions.moveSelection('up'),
      },
      { hotkey: 'F2', callback: interactions.startEditingActive },
      {
        hotkey: 'Delete',
        callback: () => runAndRefocus(interactions.clearSelection),
      },
      {
        hotkey: 'Backspace',
        callback: () => runAndRefocus(interactions.clearSelection),
      },
      {
        hotkey: 'Escape',
        callback: () => table.resetCellSelection(true),
      },
      { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
      { hotkey: 'Mod+Z', callback: () => runAndRefocus(interactions.undo) },
      {
        hotkey: 'Mod+Shift+Z',
        callback: () => runAndRefocus(interactions.redo),
      },
      { hotkey: 'Mod+Y', callback: () => runAndRefocus(interactions.redo) },
    ],
    () => ({
      target: scrollRef,
      enabled: interactions.editing() == null,
      preventDefault: true,
      stopPropagation: true,
    }),
  )
  const runAndRefocus = (action: () => void) => {
    action()
    requestAnimationFrame(() => scrollRef?.focus({ preventScroll: true }))
  }
  const startColumns = createMemo(() => table.getStartVisibleLeafColumns())
  const centerColumns = createMemo(() => table.getCenterVisibleLeafColumns())
  const endColumns = createMemo(() => table.getEndVisibleLeafColumns())
  const topRows = createMemo(() => table.getTopRows())
  const centerRows = createMemo(() => table.getCenterRows())
  const startWidth = createMemo(() =>
    startColumns().reduce((total, column) => total + column.getSize(), 0),
  )
  const endWidth = createMemo(() =>
    endColumns().reduce((total, column) => total + column.getSize(), 0),
  )
  const frozenRowsHeight = createMemo(() => topRows().length * ROW_HEIGHT)

  const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    get count() {
      return centerRows().length
    },
    getScrollElement: () => scrollRef ?? null,
    getItemKey: (index) => centerRows()[index]?.id ?? index,
    estimateSize: () => ROW_HEIGHT,
    get paddingStart() {
      return HEADER_HEIGHT + frozenRowsHeight()
    },
    get scrollPaddingStart() {
      return HEADER_HEIGHT + frozenRowsHeight()
    },
    overscan: 8,
  })

  const columnVirtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    get count() {
      return centerColumns().length
    },
    getScrollElement: () => scrollRef ?? null,
    getItemKey: (index) => centerColumns()[index]?.id ?? index,
    estimateSize: (index) => centerColumns()[index]?.getSize() ?? 120,
    horizontal: true,
    get paddingStart() {
      return ROW_HEADER_WIDTH + startWidth()
    },
    get paddingEnd() {
      return endWidth()
    },
    get scrollPaddingStart() {
      return ROW_HEADER_WIDTH + startWidth()
    },
    get scrollPaddingEnd() {
      return endWidth()
    },
    overscan: 3,
  })

  createEffect(() => {
    void table.atoms.columnSizing.get()
    columnVirtualizer.measure()
  })

  onMount(() => {
    props.onReady({
      scrollToCell(rowId, columnId) {
        const topRowIds = new Set(topRows().map((row) => row.id))
        if (!topRowIds.has(rowId)) {
          const rowIndex = centerRows().findIndex((row) => row.id === rowId)
          if (rowIndex >= 0) rowVirtualizer.scrollToIndex(rowIndex)
        }

        const startColumnIds = new Set(
          startColumns().map((column) => column.id),
        )
        const endColumnIds = new Set(endColumns().map((column) => column.id))
        if (!startColumnIds.has(columnId) && !endColumnIds.has(columnId)) {
          const columnIndex = centerColumns().findIndex(
            (column) => column.id === columnId,
          )
          if (columnIndex >= 0) columnVirtualizer.scrollToIndex(columnIndex)
        }
      },
    })
  })

  const [openMenu, setOpenMenu] = createSignal<OpenColumnMenu | null>(null)
  const [openCellMenu, setOpenCellMenu] = createSignal<OpenCellMenu | null>(
    null,
  )
  const [fillPreview, setFillPreview] = createSignal<FillPreview | null>(null)
  let fillDrag: FillDrag | null = null
  let headerSelectionDrag: HeaderSelectionDrag | null = null
  let pointer = { clientX: 0, clientY: 0 }
  let scrollFrame: number | null = null

  const getDisplayColumns = useCallback(
    () => [...startColumns(), ...centerColumns(), ...endColumns()],
    [centerColumns(), endColumns(), startColumns()],
  )

  const resolveCoordinate = useCallback(
    (clientX: number, clientY: number): GridCoordinate | null => {
      const element = scrollRef
      if (!element) return null
      const rect = element.getBoundingClientRect()
      const localX = Math.min(
        Math.max(clientX - rect.left, ROW_HEADER_WIDTH + 1),
        rect.width - 1,
      )
      const localY = Math.min(
        Math.max(clientY - rect.top, HEADER_HEIGHT + 1),
        rect.height - 1,
      )

      const hit = document.elementFromPoint(clientX, clientY)
      const hitRowIndex = Number(
        hit?.closest<HTMLElement>('[data-row-index]')?.dataset.rowIndex,
      )
      let row: SpreadsheetTableRow | undefined = Number.isFinite(hitRowIndex)
        ? table.getRowsInDisplayOrder()[hitRowIndex]
        : undefined
      if (
        !row &&
        topRows().length &&
        localY < HEADER_HEIGHT + frozenRowsHeight()
      ) {
        const topIndex = Math.min(
          topRows().length - 1,
          Math.max(0, Math.floor((localY - HEADER_HEIGHT) / ROW_HEIGHT)),
        )
        row = topRows()[topIndex]
      } else if (!row) {
        const item = rowVirtualizer.getVirtualItemForOffset(
          element.scrollTop + localY,
        )
        row = item ? centerRows()[item.index] : undefined
      }

      const hitColumnId =
        hit?.closest<HTMLElement>('[data-column-id]')?.dataset.columnId
      let column: SpreadsheetTableColumn | undefined = hitColumnId
        ? getDisplayColumns().find((candidate) => candidate.id === hitColumnId)
        : undefined
      if (
        !column &&
        startColumns().length &&
        localX < ROW_HEADER_WIDTH + startWidth()
      ) {
        let offset = ROW_HEADER_WIDTH
        column = startColumns().find((candidate) => {
          const nextOffset = offset + candidate.getSize()
          const match = localX >= offset && localX < nextOffset
          offset = nextOffset
          return match
        })
      } else if (
        !column &&
        endColumns().length &&
        localX > rect.width - endWidth()
      ) {
        let offset = rect.width - endWidth()
        column = endColumns().find((candidate) => {
          const nextOffset = offset + candidate.getSize()
          const match = localX >= offset && localX < nextOffset
          offset = nextOffset
          return match
        })
      } else if (!column) {
        const item = columnVirtualizer.getVirtualItemForOffset(
          element.scrollLeft + localX,
        )
        column = item ? centerColumns()[item.index] : undefined
      }

      if (!row || !column) return null
      const columnIndex = table.getCellSelectionColumnIndexes()[column.id] ?? -1
      const rowIndex = row.getDisplayIndex()
      if (rowIndex < 0 || columnIndex < 0) return null
      return { rowIndex, columnIndex }
    },
    [
      centerColumns(),
      centerRows(),
      columnVirtualizer,
      endColumns(),
      endWidth(),
      frozenRowsHeight(),
      rowVirtualizer,
      startColumns(),
      startWidth(),
      table,
      topRows(),
    ],
  )

  const applyHeaderSelectionDrag = useCallback(
    (drag: HeaderSelectionDrag, focusId: string) => {
      if (drag.axis === 'column') {
        interactions.selectColumnRange(
          drag.anchorId,
          focusId,
          drag.baseSelection,
          drag.operation,
        )
      } else {
        interactions.selectRowRange(
          drag.anchorId,
          focusId,
          drag.baseSelection,
          drag.operation,
        )
      }
    },
    [interactions],
  )

  const updateDragTarget = useCallback(
    (event: MouseEvent) => {
      const coordinate = resolveCoordinate(event.clientX, event.clientY)
      if (!coordinate) return

      const activeFillDrag = fillDrag
      if (activeFillDrag) {
        const preview = getFillPreview(activeFillDrag.source, coordinate)
        activeFillDrag.preview = preview
        setFillPreview(preview)
        return
      }

      const headerDrag = headerSelectionDrag
      if (headerDrag) {
        const focusId =
          headerDrag.axis === 'column'
            ? getDisplayColumns()[coordinate.columnIndex]?.id
            : table.getRowsInDisplayOrder()[coordinate.rowIndex]?.id
        if (focusId) applyHeaderSelectionDrag(headerDrag, focusId)
        return
      }

      if (!table._isSelectingCells) return
      const row = table.getRowsInDisplayOrder()[coordinate.rowIndex]
      const column = getDisplayColumns()[coordinate.columnIndex]
      row.getAllCellsByColumnId()[column.id].getSelectionExtendHandler()(event)
    },
    [applyHeaderSelectionDrag, getDisplayColumns, resolveCoordinate, table],
  )

  const runEdgeScroll = useCallback(() => {
    scrollFrame = null
    if (!fillDrag && !headerSelectionDrag && !table._isSelectingCells) {
      return
    }

    const element = scrollRef
    if (!element) return
    const rect = element.getBoundingClientRect()
    const { clientX, clientY } = pointer
    const topBoundary = rect.top + HEADER_HEIGHT + frozenRowsHeight()
    const leftBoundary = rect.left + ROW_HEADER_WIDTH + startWidth()
    const rightBoundary = rect.right - endWidth()

    const headerDrag = headerSelectionDrag
    const deltaX =
      headerDrag?.axis === 'row'
        ? 0
        : edgeDelta(clientX, leftBoundary, rightBoundary, EDGE_SCROLL_ZONE)
    const deltaY =
      headerDrag?.axis === 'column'
        ? 0
        : edgeDelta(clientY, topBoundary, rect.bottom, EDGE_SCROLL_ZONE)

    if (deltaX || deltaY) {
      element.scrollLeft += deltaX
      element.scrollTop += deltaY
      const syntheticEvent = new MouseEvent('mousemove', {
        clientX,
        clientY,
        bubbles: true,
      })
      updateDragTarget(syntheticEvent)
    }

    scrollFrame = requestAnimationFrame(runEdgeScroll)
  }, [endWidth(), frozenRowsHeight(), startWidth(), table, updateDragTarget])

  const ensureEdgeScroll = useCallback(() => {
    if (scrollFrame == null) {
      scrollFrame = requestAnimationFrame(runEdgeScroll)
    }
  }, [runEdgeScroll])

  const startHeaderSelection = useCallback(
    (
      event: MouseEvent,
      axis: HeaderSelectionDrag['axis'],
      id: string,
      fullySelected: boolean,
    ) => {
      if (event.button !== 0) return
      event.preventDefault()
      scrollRef?.focus({ preventScroll: true })

      const currentSelection = table.atoms.cellSelection.get()
      const activeOperation = currentSelection.at(-1)
      let anchorId = id
      let baseSelection: CellSelectionState = []
      let operation: CellSelectionRangeOperation = 'include'

      if (event.shiftKey && activeOperation) {
        anchorId =
          axis === 'column'
            ? activeOperation.anchorColumnId
            : activeOperation.anchorRowId
        baseSelection = currentSelection.slice(0, -1)
        operation = activeOperation.operation ?? 'include'
      } else if (event.metaKey || event.ctrlKey) {
        baseSelection = currentSelection
        operation = fullySelected ? 'exclude' : 'include'
      }

      const drag = { axis, anchorId, baseSelection, operation }
      headerSelectionDrag = drag
      pointer = { clientX: event.clientX, clientY: event.clientY }
      applyHeaderSelectionDrag(drag, id)
      ensureEdgeScroll()
    },
    [applyHeaderSelectionDrag, ensureEdgeScroll, table],
  )

  const extendHeaderSelection = useCallback(
    (axis: HeaderSelectionDrag['axis'], id: string) => {
      const drag = headerSelectionDrag
      if (drag?.axis === axis) applyHeaderSelectionDrag(drag, id)
    },
    [applyHeaderSelectionDrag],
  )

  onMount(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointer = {
        clientX: event.clientX,
        clientY: event.clientY,
      }
      if (fillDrag || headerSelectionDrag || table._isSelectingCells) {
        updateDragTarget(event)
        ensureEdgeScroll()
      }
    }

    const handleMouseUp = () => {
      const activeFillDrag = fillDrag
      if (activeFillDrag?.preview) {
        interactions.applyFill(activeFillDrag.source, activeFillDrag.preview)
      }
      fillDrag = null
      headerSelectionDrag = null
      setFillPreview(null)
      if (scrollFrame != null) {
        cancelAnimationFrame(scrollFrame)
        scrollFrame = null
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    onCleanup(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (scrollFrame != null) {
        cancelAnimationFrame(scrollFrame)
      }
    })
  })

  const startFillDrag = useCallback(
    (event: MouseEvent, source: GridBounds) => {
      event.preventDefault()
      event.stopPropagation()
      scrollRef?.focus({ preventScroll: true })
      pointer = {
        clientX: event.clientX,
        clientY: event.clientY,
      }
      fillDrag = { source, preview: null }
      setFillPreview(null)
      ensureEdgeScroll()
    },
    [ensureEdgeScroll],
  )

  const virtualRows = createMemo(() => rowVirtualizer.getVirtualItems())
  const virtualColumns = createMemo(() => columnVirtualizer.getVirtualItems())
  const canvasWidth = createMemo(() =>
    Math.max(columnVirtualizer.getTotalSize(), 720),
  )
  const canvasHeight = createMemo(() =>
    Math.max(rowVirtualizer.getTotalSize(), 320),
  )

  return (
    <>
      <div
        ref={scrollRef}
        class="spreadsheet-grid"
        data-testid="spreadsheet-grid"
        role="grid"
        tabIndex={0}
        aria-rowcount={table.getRowsInDisplayOrder().length}
        aria-colcount={getDisplayColumns().length}
        onKeyDown={interactions.handleGridTextEntry}
        onCopy={interactions.copySelection}
        onCut={interactions.cutSelection}
        onPaste={interactions.pasteSelection}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.focus({ preventScroll: true })
          }
        }}
      >
        <div
          class="spreadsheet-canvas"
          data-zoom={props.zoom}
          style={{
            width: `${canvasWidth()}px`,
            height: `${canvasHeight()}px`,
            zoom: props.zoom / 100,
          }}
        >
          <HeaderRow
            table={table}
            virtualColumns={virtualColumns()}
            centerHeaders={table.getCenterLeafHeaders()}
            startHeaders={table.getStartLeafHeaders()}
            endHeaders={table.getEndLeafHeaders()}
            onStartSelection={startHeaderSelection}
            onExtendSelection={extendHeaderSelection}
            onOpenMenu={(column, rect) => setOpenMenu({ column, rect })}
          />

          {topRows().length ? (
            <div
              class="frozen-row-region"
              style={{ height: `${frozenRowsHeight()}px` }}
            >
              {topRows().map((row, index) => (
                <SubscribedRow
                  row={row}
                  top={index * ROW_HEIGHT}
                  frozen
                  table={table}
                  virtualColumns={virtualColumns()}
                  interactions={interactions}
                  onStartHeaderSelection={startHeaderSelection}
                  onExtendHeaderSelection={extendHeaderSelection}
                  fillPreview={fillPreview()}
                  onStartFill={startFillDrag}
                  onOpenContextMenu={(x, y, column) => {
                    setOpenMenu(null)
                    setOpenCellMenu({ x, y, column })
                  }}
                />
              ))}
            </div>
          ) : null}

          {virtualRows().map((virtualRow) => {
            const row = centerRows()[virtualRow.index]
            return (
              <SubscribedRow
                row={row}
                top={virtualRow.start}
                frozen={false}
                table={table}
                virtualColumns={virtualColumns()}
                interactions={interactions}
                onStartHeaderSelection={startHeaderSelection}
                onExtendHeaderSelection={extendHeaderSelection}
                fillPreview={fillPreview()}
                onStartFill={startFillDrag}
                onOpenContextMenu={(x, y, column) => {
                  setOpenMenu(null)
                  setOpenCellMenu({ x, y, column })
                }}
              />
            )
          })}
        </div>
      </div>

      {openMenu() ? (
        <ColumnMenu
          anchorRect={openMenu()!.rect}
          column={openMenu()!.column}
          table={table}
          onClose={() => setOpenMenu(null)}
        />
      ) : null}
      {openCellMenu() ? (
        <CellContextMenu
          x={openCellMenu()!.x}
          y={openCellMenu()!.y}
          column={openCellMenu()!.column}
          table={table}
          interactions={interactions}
          onClose={() => setOpenCellMenu(null)}
        />
      ) : null}
    </>
  )
}

interface HeaderRowProps {
  table: SpreadsheetTable
  virtualColumns: Array<VirtualItem>
  centerHeaders: Array<SpreadsheetTableHeader>
  startHeaders: Array<SpreadsheetTableHeader>
  endHeaders: Array<SpreadsheetTableHeader>
  onStartSelection: (
    event: MouseEvent,
    axis: 'column',
    id: string,
    fullySelected: boolean,
  ) => void
  onExtendSelection: (axis: 'column', id: string) => void
  onOpenMenu: (column: SpreadsheetTableColumn, rect: DOMRect) => void
}

// Do not destructure these props. The header row is created once, so reading a
// prop here instead of inside the JSX would freeze it at its mount-time value:
// column pinning is applied in an effect after mount, so `startHeaders` would
// stay empty and `centerHeaders` would keep every column, leaving the pinned
// column with no header and shifting every letter one column to the left.
function HeaderRow(props: HeaderRowProps) {
  const rowCount = () => props.table.getRowsInDisplayOrder().length

  return (
    <div
      class="spreadsheet-row spreadsheet-header-row"
      role="row"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <button
        type="button"
        class="corner-header"
        aria-label="Select all cells"
        onClick={() => props.table.selectAllCells()}
      >
        <span />
      </button>
      {props.startHeaders.map((header) => (
        <HeaderCell
          header={header}
          pinned="start"
          table={props.table}
          rowCount={rowCount()}
          onStartSelection={props.onStartSelection}
          onExtendSelection={props.onExtendSelection}
          onOpenMenu={props.onOpenMenu}
        />
      ))}
      {props.virtualColumns.map((virtualColumn) => {
        // The virtualizer's item count trails a column swap by a tick, so an
        // index can briefly point past the end of the header list.
        const header = props.centerHeaders.at(virtualColumn.index)
        return header ? (
          <HeaderCell
            header={header}
            left={virtualColumn.start}
            table={props.table}
            rowCount={rowCount()}
            onStartSelection={props.onStartSelection}
            onExtendSelection={props.onExtendSelection}
            onOpenMenu={props.onOpenMenu}
          />
        ) : null
      })}
      {props.endHeaders.map((header) => (
        <HeaderCell
          header={header}
          pinned="end"
          table={props.table}
          rowCount={rowCount()}
          onStartSelection={props.onStartSelection}
          onExtendSelection={props.onExtendSelection}
          onOpenMenu={props.onOpenMenu}
        />
      ))}
    </div>
  )
}

interface HeaderCellProps {
  header: SpreadsheetTableHeader
  table: SpreadsheetTable
  rowCount: number
  onStartSelection: HeaderRowProps['onStartSelection']
  onExtendSelection: HeaderRowProps['onExtendSelection']
  left?: number
  pinned?: 'start' | 'end'
  onOpenMenu: (column: SpreadsheetTableColumn, rect: DOMRect) => void
}

function HeaderCell({
  header,
  table,
  rowCount,
  onStartSelection,
  left,
  pinned,
  onOpenMenu,
}: HeaderCellProps) {
  const { column } = header
  const columnIndex = table.getCellSelectionColumnIndexes()[column.id] ?? -1
  const fullySelected = () =>
    table
      .getCellSelectionBounds()
      .some(
        (bound) =>
          bound.minRowIndex === 0 &&
          bound.maxRowIndex === rowCount - 1 &&
          columnIndex >= bound.minColumnIndex &&
          columnIndex <= bound.maxColumnIndex,
      )
  const meta = column.columnDef.meta
  const sorted = column.getIsSorted()
  const filtered = column.getIsFiltered()
  const style = getColumnPositionStyle(column, left, pinned)

  return (
    <div
      class={[
        'column-header',
        pinned && 'column-pinned',
        fullySelected() && 'header-selected',
      ]
        .filter(Boolean)
        .join(' ')}
      role="columnheader"
      data-column-id={column.id}
      aria-colindex={columnIndex + 1}
      aria-selected={fullySelected()}
      style={style}
      onMouseDown={(event) =>
        onStartSelection(event, 'column', column.id, fullySelected())
      }
    >
      <span class="column-letter">{meta?.letter}</span>
      <button
        type="button"
        class={[
          'column-menu-button',
          (sorted || filtered) && 'column-menu-active',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={`Open ${meta?.letter} column menu`}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          onOpenMenu(column, event.currentTarget.getBoundingClientRect())
        }}
      >
        {sorted === 'asc'
          ? '↑'
          : sorted === 'desc'
            ? '↓'
            : filtered
              ? '●'
              : '▾'}
      </button>
      <div
        class={[
          'column-resizer',
          column.getIsResizing() && 'column-resizer-active',
        ]
          .filter(Boolean)
          .join(' ')}
        role="separator"
        aria-label={`Resize column ${meta?.letter}`}
        onDblClick={(event) => {
          event.stopPropagation()
          const width = getAutoFitColumnWidth(table, column)
          table.setColumnSizing((current) => ({
            ...current,
            [column.id]: width,
          }))
        }}
        onMouseDown={(event) => {
          event.stopPropagation()
          header.getResizeHandler()(event)
        }}
        onTouchStart={(event) => {
          event.stopPropagation()
          header.getResizeHandler()(event)
        }}
      />
    </div>
  )
}

interface SubscribedRowProps {
  row: SpreadsheetTableRow
  top: number
  frozen: boolean
  table: SpreadsheetTable
  virtualColumns: Array<VirtualItem>
  interactions: GridInteractions
  onStartHeaderSelection: (
    event: MouseEvent,
    axis: 'row',
    id: string,
    fullySelected: boolean,
  ) => void
  onExtendHeaderSelection: (axis: 'row', id: string) => void
  fillPreview: FillPreview | null
  onStartFill: (event: MouseEvent, source: GridBounds) => void
  onOpenContextMenu: (
    x: number,
    y: number,
    column: SpreadsheetTableColumn,
  ) => void
}

function SubscribedRow(props: SubscribedRowProps) {
  return <SpreadsheetRowView {...props} />
}

function SpreadsheetRowView({
  row,
  top,
  frozen,
  table,
  virtualColumns,
  interactions,
  onStartHeaderSelection,
  onExtendHeaderSelection,
  fillPreview,
  onStartFill,
  onOpenContextMenu,
}: SubscribedRowProps) {
  const rowIndex = row.getDisplayIndex()
  const centerCells = row.getCenterVisibleCells()
  const startCells = row.getStartVisibleCells()
  const endCells = row.getEndVisibleCells()
  const fullySelected = () =>
    table
      .getCellSelectionBounds()
      .some(
        (bound) =>
          bound.minColumnIndex === 0 &&
          bound.maxColumnIndex ===
            [
              ...table.getStartVisibleLeafColumns(),
              ...table.getCenterVisibleLeafColumns(),
              ...table.getEndVisibleLeafColumns(),
            ].length -
              1 &&
          rowIndex >= bound.minRowIndex &&
          rowIndex <= bound.maxRowIndex,
      )

  return (
    <div
      class={[
        'spreadsheet-row',
        'spreadsheet-data-row',
        frozen && 'spreadsheet-row-frozen',
        row.original.kind === 'field-header' && 'spreadsheet-field-row',
      ]
        .filter(Boolean)
        .join(' ')}
      role="row"
      aria-rowindex={rowIndex + 1}
      data-row-index={rowIndex}
      style={{
        height: `${ROW_HEIGHT}px`,
        transform: `translateY(${top}px)`,
      }}
    >
      <button
        type="button"
        class={fullySelected() ? 'row-header header-selected' : 'row-header'}
        aria-label={`Select row ${rowIndex + 1}`}
        aria-selected={fullySelected()}
        onMouseDown={(event) =>
          onStartHeaderSelection(event, 'row', row.id, fullySelected())
        }
        onMouseEnter={() => onExtendHeaderSelection('row', row.id)}
      >
        {rowIndex + 1}
      </button>
      {startCells.map((cell) => (
        <SpreadsheetCell
          cell={cell}
          rowIndex={rowIndex}
          fillPreview={fillPreview}
          pinned="start"
          table={table}
          interactions={interactions}
          onStartFill={onStartFill}
          onOpenContextMenu={onOpenContextMenu}
        />
      ))}
      {virtualColumns.map((virtualColumn) => {
        const cell = centerCells[virtualColumn.index]
        return (
          <SpreadsheetCell
            cell={cell}
            rowIndex={rowIndex}
            fillPreview={fillPreview}
            left={virtualColumn.start}
            table={table}
            interactions={interactions}
            onStartFill={onStartFill}
            onOpenContextMenu={onOpenContextMenu}
          />
        )
      })}
      {endCells.map((cell) => (
        <SpreadsheetCell
          cell={cell}
          rowIndex={rowIndex}
          fillPreview={fillPreview}
          pinned="end"
          table={table}
          interactions={interactions}
          onStartFill={onStartFill}
          onOpenContextMenu={onOpenContextMenu}
        />
      ))}
    </div>
  )
}

interface SpreadsheetCellProps {
  cell: SpreadsheetTableCell
  rowIndex: number
  fillPreview: FillPreview | null
  table: SpreadsheetTable
  interactions: GridInteractions
  left?: number
  pinned?: 'start' | 'end'
  onStartFill: (event: MouseEvent, source: GridBounds) => void
  onOpenContextMenu: (
    x: number,
    y: number,
    column: SpreadsheetTableColumn,
  ) => void
}

function SpreadsheetCell({
  cell,
  rowIndex,
  fillPreview,
  table,
  interactions,
  left,
  pinned,
  onStartFill,
  onOpenContextMenu,
}: SpreadsheetCellProps) {
  const columnIndex = () =>
    table.getCellSelectionColumnIndexes()[cell.column.id] ?? -1
  const currentBound = () => table.getCellSelectionBounds().at(-1)
  const showFillHandle = () => {
    const bound = currentBound()
    return Boolean(
      bound &&
      rowIndex === bound.maxRowIndex &&
      columnIndex() === bound.maxColumnIndex,
    )
  }
  const isEditing = () => {
    const editing = interactions.editing()
    return editing?.rowId === cell.row.id && editing.columnId === cell.column.id
  }
  const className = () => {
    const edges = cell.getSelectionEdges()
    return [
      'spreadsheet-cell',
      pinned && 'cell-pinned',
      cell.getIsSelected() && 'cell-selected',
      cell.getIsFocused() && 'cell-focused',
      edges.top && 'cell-edge-top',
      edges.right && 'cell-edge-right',
      edges.bottom && 'cell-edge-bottom',
      edges.left && 'cell-edge-left',
      fillPreview &&
        isWithinBounds(fillPreview.destination, rowIndex, columnIndex()) &&
        'cell-fill-preview',
      cell.row.original.kind === 'field-header' && 'cell-field-header',
    ]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <div
      class={className()}
      role="gridcell"
      aria-colindex={columnIndex() + 1}
      aria-selected={cell.getIsSelected()}
      data-sheet-cell
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      tabIndex={isEditing() ? -1 : cell.getTabIndex()}
      style={getColumnPositionStyle(cell.column, left, pinned)}
      onMouseDown={(event) => {
        if (isEditing() || event.button !== 0) return
        const grid =
          event.currentTarget.closest<HTMLElement>('.spreadsheet-grid')
        grid?.focus({ preventScroll: true })
        cell.getSelectionStartHandler(document)(event)
      }}
      onMouseEnter={cell.getSelectionExtendHandler()}
      onDblClick={() => interactions.startEditing(cell.row.id, cell.column.id)}
      onContextMenu={(event) => {
        event.preventDefault()
        event.currentTarget
          .closest<HTMLElement>('.spreadsheet-grid')
          ?.focus({ preventScroll: true })
        onOpenContextMenu(event.clientX, event.clientY, cell.column)
      }}
    >
      {isEditing() ? (
        <input
          autofocus
          class="cell-editor"
          aria-label={`Edit ${cell.column.columnDef.meta?.letter}${rowIndex + 1}`}
          value={interactions.editing()?.draft ?? ''}
          onFocus={(event) => event.currentTarget.select()}
          onMouseDown={(event) => event.stopPropagation()}
          onInput={(event) =>
            interactions.setEditingDraft(event.currentTarget.value)
          }
          onKeyDown={interactions.handleEditorKeyDown}
          onBlur={() => interactions.commitEditing()}
        />
      ) : (
        <span class="cell-value">{formatRenderedValue(cell.getValue())}</span>
      )}
      {showFillHandle() ? (
        <span
          class="fill-handle"
          data-testid="fill-handle"
          aria-label="Drag to fill"
          onMouseDown={(event) =>
            onStartFill(event, {
              minRowIndex: currentBound()!.minRowIndex,
              maxRowIndex: currentBound()!.maxRowIndex,
              minColumnIndex: currentBound()!.minColumnIndex,
              maxColumnIndex: currentBound()!.maxColumnIndex,
            })
          }
        />
      ) : null}
    </div>
  )
}

function getColumnPositionStyle(
  column: SpreadsheetTableColumn,
  left?: number,
  pinned?: 'start' | 'end',
): JSX.CSSProperties {
  if (pinned === 'start') {
    return {
      width: `${column.getSize()}px`,
      'inset-inline-start': `${ROW_HEADER_WIDTH + column.getStart('start')}px`,
    }
  }
  if (pinned === 'end') {
    return {
      width: `${column.getSize()}px`,
      'inset-inline-end': `${column.getAfter('end')}px`,
    }
  }
  return {
    width: `${column.getSize()}px`,
    left: left == null ? undefined : `${left}px`,
  }
}

function isWithinBounds(
  bounds: GridBounds,
  rowIndex: number,
  columnIndex: number,
) {
  return (
    rowIndex >= bounds.minRowIndex &&
    rowIndex <= bounds.maxRowIndex &&
    columnIndex >= bounds.minColumnIndex &&
    columnIndex <= bounds.maxColumnIndex
  )
}

function formatRenderedValue(value: unknown) {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  if (typeof value === 'number') {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(value)
  }
  return String(value)
}

let textMeasurementContext: CanvasRenderingContext2D | null = null

function measureTextWidth(value: string, bold = false) {
  if (!textMeasurementContext) {
    textMeasurementContext = document.createElement('canvas').getContext('2d')
  }
  if (!textMeasurementContext) return value.length * 6

  textMeasurementContext.font = `${bold ? '600 ' : ''}11px Arial, sans-serif`
  return textMeasurementContext.measureText(value).width
}

function getAutoFitColumnWidth(
  table: SpreadsheetTable,
  column: SpreadsheetTableColumn,
) {
  const columnIndex = column.columnDef.meta?.index
  if (columnIndex == null) return column.getSize()

  let widest = 0
  for (const row of table.options.data) {
    widest = Math.max(
      widest,
      measureTextWidth(
        formatRenderedValue(row.cells[columnIndex]),
        row.kind === 'field-header',
      ),
    )
  }

  return Math.max(
    column.columnDef.minSize ?? 0,
    Math.ceil(widest + CELL_HORIZONTAL_PADDING + 2),
  )
}

function edgeDelta(value: number, start: number, end: number, zone: number) {
  if (value < start + zone) {
    const ratio = Math.min(1, Math.max(0, (start + zone - value) / zone))
    return -Math.ceil(MAX_EDGE_SCROLL_SPEED * ratio)
  }
  if (value > end - zone) {
    const ratio = Math.min(1, Math.max(0, (value - (end - zone)) / zone))
    return Math.ceil(MAX_EDGE_SCROLL_SPEED * ratio)
  }
  return 0
}

function useCallback<TArgs extends Array<unknown>, TResult>(
  callback: (...args: TArgs) => TResult,
  _dependencies?: Array<unknown>,
): (...args: TArgs) => TResult {
  return callback
}
