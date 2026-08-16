import React from 'react'
import { useHotkeys } from '@tanstack/react-hotkeys'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CellContextMenu } from './CellContextMenu'
import { ColumnMenu } from './ColumnMenu'
import { getFillPreview } from './spreadsheetModel'
import type {
  CellSelectionBounds,
  CellSelectionRangeOperation,
  CellSelectionState,
} from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
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
import type { GridInteractions } from './useGridInteractions'

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
  onToggleMerge?: () => void
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

export const SpreadsheetGrid = React.forwardRef<
  SpreadsheetGridHandle,
  SpreadsheetGridProps
>(function SpreadsheetGrid(
  { table, interactions, zoom, onToggleMerge },
  forwardedRef,
) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useHotkeys(
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
      { hotkey: 'Delete', callback: interactions.clearSelection },
      { hotkey: 'Backspace', callback: interactions.clearSelection },
      {
        hotkey: 'Escape',
        callback: () => table.resetCellSelection(true),
      },
      { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
      { hotkey: 'Mod+M', callback: () => onToggleMerge?.() },
      { hotkey: 'Mod+Z', callback: interactions.undo },
      { hotkey: 'Mod+Shift+Z', callback: interactions.redo },
      { hotkey: 'Mod+Y', callback: interactions.redo },
    ],
    {
      target: scrollRef,
      enabled: interactions.editing == null,
      preventDefault: true,
      stopPropagation: true,
    },
  )
  const startColumns = table.getStartVisibleLeafColumns()
  const centerColumns = table.getCenterVisibleLeafColumns()
  const endColumns = table.getEndVisibleLeafColumns()
  const topRows = table.getTopRows()
  const centerRows = table.getCenterRows()
  const columnSizing = table.state.columnSizing
  const startWidth = startColumns.reduce(
    (total, column) => total + getColumnSize(column, columnSizing),
    0,
  )
  const endWidth = endColumns.reduce(
    (total, column) => total + getColumnSize(column, columnSizing),
    0,
  )
  const frozenRowsHeight = topRows.length * ROW_HEIGHT

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: centerRows.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => centerRows[index]?.id ?? index,
    estimateSize: () => ROW_HEIGHT,
    paddingStart: HEADER_HEIGHT + frozenRowsHeight,
    scrollPaddingStart: HEADER_HEIGHT + frozenRowsHeight,
    overscan: 8,
  })

  const columnVirtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: centerColumns.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => centerColumns[index]?.id ?? index,
    estimateSize: (index) =>
      getColumnSize(centerColumns[index], columnSizing, 120),
    horizontal: true,
    paddingStart: ROW_HEADER_WIDTH + startWidth,
    paddingEnd: endWidth,
    scrollPaddingStart: ROW_HEADER_WIDTH + startWidth,
    scrollPaddingEnd: endWidth,
    overscan: 3,
  })

  React.useEffect(() => {
    columnVirtualizer.measure()
  }, [columnVirtualizer, table.state.columnSizing])

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      scrollToCell(rowId, columnId) {
        const topRowIds = new Set(topRows.map((row) => row.id))
        if (!topRowIds.has(rowId)) {
          const rowIndex = centerRows.findIndex((row) => row.id === rowId)
          if (rowIndex >= 0) rowVirtualizer.scrollToIndex(rowIndex)
        }

        const startColumnIds = new Set(startColumns.map((column) => column.id))
        const endColumnIds = new Set(endColumns.map((column) => column.id))
        if (!startColumnIds.has(columnId) && !endColumnIds.has(columnId)) {
          const columnIndex = centerColumns.findIndex(
            (column) => column.id === columnId,
          )
          if (columnIndex >= 0) columnVirtualizer.scrollToIndex(columnIndex)
        }
      },
    }),
    [
      centerColumns,
      centerRows,
      columnVirtualizer,
      endColumns,
      rowVirtualizer,
      startColumns,
      topRows,
    ],
  )

  // Center-region merged cells live in a canvas-coordinate layer that must
  // slide *under* the sticky row gutter and frozen columns. Row transforms
  // create stacking contexts that flatten the pinned cells' z-index below any
  // canvas-level overlay, so instead of fighting z-index the layer clips
  // itself at the pinned edge, tracked directly on scroll to stay off the
  // React render path.
  const mergeClipRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = scrollRef.current
    const layer = mergeClipRef.current
    if (!element || !layer) return

    const update = () => {
      const scale = zoom / 100
      layer.style.clipPath = `inset(0 0 0 ${
        element.scrollLeft / scale + ROW_HEADER_WIDTH + startWidth
      }px)`
    }

    update()
    element.addEventListener('scroll', update, { passive: true })
    return () => element.removeEventListener('scroll', update)
  }, [startWidth, zoom])

  const [openMenu, setOpenMenu] = React.useState<OpenColumnMenu | null>(null)
  const [openCellMenu, setOpenCellMenu] = React.useState<OpenCellMenu | null>(
    null,
  )
  const [fillPreview, setFillPreview] = React.useState<FillPreview | null>(null)
  const fillDragRef = React.useRef<FillDrag | null>(null)
  const headerSelectionDragRef = React.useRef<HeaderSelectionDrag | null>(null)
  const pointerRef = React.useRef({ clientX: 0, clientY: 0 })
  const scrollFrameRef = React.useRef<number | null>(null)

  const getDisplayColumns = React.useCallback(
    () => [...startColumns, ...centerColumns, ...endColumns],
    [centerColumns, endColumns, startColumns],
  )

  const resolveCoordinate = React.useCallback(
    (clientX: number, clientY: number): GridCoordinate | null => {
      const element = scrollRef.current
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

      let row: SpreadsheetTableRow | undefined
      if (topRows.length && localY < HEADER_HEIGHT + frozenRowsHeight) {
        const topIndex = Math.min(
          topRows.length - 1,
          Math.max(0, Math.floor((localY - HEADER_HEIGHT) / ROW_HEIGHT)),
        )
        row = topRows[topIndex]
      } else {
        const item = rowVirtualizer.getVirtualItemForOffset(
          element.scrollTop + localY,
        )
        row = item ? centerRows[item.index] : undefined
      }

      let column: SpreadsheetTableColumn | undefined
      if (startColumns.length && localX < ROW_HEADER_WIDTH + startWidth) {
        let offset = ROW_HEADER_WIDTH
        column = startColumns.find((candidate) => {
          const nextOffset = offset + candidate.getSize()
          const match = localX >= offset && localX < nextOffset
          offset = nextOffset
          return match
        })
      } else if (endColumns.length && localX > rect.width - endWidth) {
        let offset = rect.width - endWidth
        column = endColumns.find((candidate) => {
          const nextOffset = offset + candidate.getSize()
          const match = localX >= offset && localX < nextOffset
          offset = nextOffset
          return match
        })
      } else {
        const item = columnVirtualizer.getVirtualItemForOffset(
          element.scrollLeft + localX,
        )
        column = item ? centerColumns[item.index] : undefined
      }

      if (!row || !column) return null
      const columnIndex = table.getCellSelectionColumnIndexes()[column.id] ?? -1
      const rowIndex = row.getDisplayIndex()
      if (rowIndex < 0 || columnIndex < 0) return null
      return { rowIndex, columnIndex }
    },
    [
      centerColumns,
      centerRows,
      columnVirtualizer,
      endColumns,
      endWidth,
      frozenRowsHeight,
      rowVirtualizer,
      startColumns,
      startWidth,
      table,
      topRows,
    ],
  )

  const applyHeaderSelectionDrag = React.useCallback(
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

  const updateDragTarget = React.useCallback(
    (event: MouseEvent) => {
      const coordinate = resolveCoordinate(event.clientX, event.clientY)
      if (!coordinate) return

      const fillDrag = fillDragRef.current
      if (fillDrag) {
        const preview = getFillPreview(fillDrag.source, coordinate)
        fillDrag.preview = preview
        setFillPreview(preview)
        return
      }

      const headerDrag = headerSelectionDragRef.current
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

  const runEdgeScroll = React.useCallback(() => {
    scrollFrameRef.current = null
    if (
      !fillDragRef.current &&
      !headerSelectionDragRef.current &&
      !table._isSelectingCells
    ) {
      return
    }

    const element = scrollRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const { clientX, clientY } = pointerRef.current
    const topBoundary = rect.top + HEADER_HEIGHT + frozenRowsHeight
    const leftBoundary = rect.left + ROW_HEADER_WIDTH + startWidth
    const rightBoundary = rect.right - endWidth

    const headerDrag = headerSelectionDragRef.current
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

    scrollFrameRef.current = requestAnimationFrame(runEdgeScroll)
  }, [endWidth, frozenRowsHeight, startWidth, table, updateDragTarget])

  const ensureEdgeScroll = React.useCallback(() => {
    if (scrollFrameRef.current == null) {
      scrollFrameRef.current = requestAnimationFrame(runEdgeScroll)
    }
  }, [runEdgeScroll])

  const startHeaderSelection = React.useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      axis: HeaderSelectionDrag['axis'],
      id: string,
      fullySelected: boolean,
    ) => {
      if (event.button !== 0) return
      event.preventDefault()
      scrollRef.current?.focus({ preventScroll: true })

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
      headerSelectionDragRef.current = drag
      pointerRef.current = { clientX: event.clientX, clientY: event.clientY }
      applyHeaderSelectionDrag(drag, id)
      ensureEdgeScroll()
    },
    [applyHeaderSelectionDrag, ensureEdgeScroll, table],
  )

  const extendHeaderSelection = React.useCallback(
    (axis: HeaderSelectionDrag['axis'], id: string) => {
      const drag = headerSelectionDragRef.current
      if (drag?.axis === axis) applyHeaderSelectionDrag(drag, id)
    },
    [applyHeaderSelectionDrag],
  )

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      }
      if (
        fillDragRef.current ||
        headerSelectionDragRef.current ||
        table._isSelectingCells
      ) {
        updateDragTarget(event)
        ensureEdgeScroll()
      }
    }

    const handleMouseUp = () => {
      const fillDrag = fillDragRef.current
      if (fillDrag?.preview) {
        interactions.applyFill(fillDrag.source, fillDrag.preview)
      }
      fillDragRef.current = null
      headerSelectionDragRef.current = null
      setFillPreview(null)
      if (scrollFrameRef.current != null) {
        cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (scrollFrameRef.current != null) {
        cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [ensureEdgeScroll, interactions, table, updateDragTarget])

  const startFillDrag = React.useCallback(
    (event: React.MouseEvent, source: GridBounds) => {
      event.preventDefault()
      event.stopPropagation()
      scrollRef.current?.focus({ preventScroll: true })
      pointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      }
      fillDragRef.current = { source, preview: null }
      setFillPreview(null)
      ensureEdgeScroll()
    },
    [ensureEdgeScroll],
  )

  const virtualRows = rowVirtualizer.getVirtualItems()
  const virtualColumns = columnVirtualizer.getVirtualItems()
  const canvasWidth = Math.max(columnVirtualizer.getTotalSize(), 720)
  const canvasHeight = Math.max(rowVirtualizer.getTotalSize(), 320)

  return (
    <>
      <div
        ref={scrollRef}
        className="spreadsheet-grid"
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
          className="spreadsheet-canvas"
          data-zoom={zoom}
          style={{
            width: canvasWidth,
            height: canvasHeight,
            zoom: zoom / 100,
          }}
        >
          <table.Subscribe
            source={table.atoms.cellSelection}
            selector={() => table.getCellSelectionBounds()}
          >
            {(selectionBounds) => (
              <HeaderRow
                table={table}
                columnFilters={table.state.columnFilters}
                columnSizing={columnSizing}
                resizingColumnId={table.state.columnResizing.isResizingColumn}
                selectionBounds={selectionBounds}
                sorting={table.state.sorting}
                virtualColumns={virtualColumns}
                centerHeaders={table.getCenterLeafHeaders()}
                startHeaders={table.getStartLeafHeaders()}
                endHeaders={table.getEndLeafHeaders()}
                onStartSelection={startHeaderSelection}
                onExtendSelection={extendHeaderSelection}
                onOpenMenu={(column, rect) => setOpenMenu({ column, rect })}
              />
            )}
          </table.Subscribe>

          {topRows.length ? (
            <div
              className="frozen-row-region"
              style={{ height: frozenRowsHeight }}
            >
              {topRows.map((row, index) => (
                <SubscribedRow
                  key={row.id}
                  row={row}
                  top={index * ROW_HEIGHT}
                  frozen
                  table={table}
                  columnSizing={columnSizing}
                  virtualColumns={virtualColumns}
                  interactions={interactions}
                  onStartHeaderSelection={startHeaderSelection}
                  onExtendHeaderSelection={extendHeaderSelection}
                  fillPreview={fillPreview}
                  onStartFill={startFillDrag}
                  onOpenContextMenu={(x, y, column) => {
                    setOpenMenu(null)
                    setOpenCellMenu({ x, y, column })
                  }}
                />
              ))}
            </div>
          ) : null}

          {virtualRows.map((virtualRow) => {
            const row = centerRows[virtualRow.index]
            return (
              <SubscribedRow
                key={row.id}
                row={row}
                top={virtualRow.start}
                frozen={false}
                table={table}
                columnSizing={columnSizing}
                virtualColumns={virtualColumns}
                interactions={interactions}
                onStartHeaderSelection={startHeaderSelection}
                onExtendHeaderSelection={extendHeaderSelection}
                fillPreview={fillPreview}
                onStartFill={startFillDrag}
                onOpenContextMenu={(x, y, column) => {
                  setOpenMenu(null)
                  setOpenCellMenu({ x, y, column })
                }}
              />
            )
          })}

          <table.Subscribe source={table.atoms.cellSelection}>
            {(cellSelection) => (
              <MergedCellsOverlay
                table={table}
                cellSelection={cellSelection}
                columnSizing={columnSizing}
                interactions={interactions}
                topRowCount={topRows.length}
                frozenRowsHeight={frozenRowsHeight}
                startWidth={startWidth}
                clipLayerRef={mergeClipRef}
                onOpenContextMenu={(x, y, column) => {
                  setOpenMenu(null)
                  setOpenCellMenu({ x, y, column })
                }}
              />
            )}
          </table.Subscribe>
        </div>
      </div>

      {openMenu ? (
        <ColumnMenu
          anchorRect={openMenu.rect}
          column={openMenu.column}
          table={table}
          onClose={() => setOpenMenu(null)}
        />
      ) : null}
      {openCellMenu ? (
        <CellContextMenu
          x={openCellMenu.x}
          y={openCellMenu.y}
          column={openCellMenu.column}
          table={table}
          interactions={interactions}
          onClose={() => setOpenCellMenu(null)}
        />
      ) : null}
    </>
  )
})

interface HeaderRowProps {
  table: SpreadsheetTable
  columnFilters: SpreadsheetTable['state']['columnFilters']
  columnSizing: SpreadsheetTable['state']['columnSizing']
  resizingColumnId: false | string
  selectionBounds: Array<CellSelectionBounds>
  sorting: SpreadsheetTable['state']['sorting']
  virtualColumns: Array<VirtualItem>
  centerHeaders: Array<SpreadsheetTableHeader>
  startHeaders: Array<SpreadsheetTableHeader>
  endHeaders: Array<SpreadsheetTableHeader>
  onStartSelection: (
    event: React.MouseEvent<HTMLElement>,
    axis: 'column',
    id: string,
    fullySelected: boolean,
  ) => void
  onExtendSelection: (axis: 'column', id: string) => void
  onOpenMenu: (column: SpreadsheetTableColumn, rect: DOMRect) => void
}

function HeaderRow({
  table,
  columnFilters,
  columnSizing,
  resizingColumnId,
  selectionBounds,
  sorting,
  virtualColumns,
  centerHeaders,
  startHeaders,
  endHeaders,
  onStartSelection,
  onExtendSelection,
  onOpenMenu,
}: HeaderRowProps) {
  const rowCount = table.getRowsInDisplayOrder().length

  return (
    <div
      className="spreadsheet-row spreadsheet-header-row"
      role="row"
      style={{ height: HEADER_HEIGHT }}
    >
      <button
        type="button"
        className="corner-header"
        aria-label="Select all cells"
        onClick={() => table.selectAllCells()}
      >
        <span />
      </button>
      {startHeaders.map((header) => (
        <HeaderCell
          key={header.id}
          header={header}
          pinned="start"
          table={table}
          bounds={selectionBounds}
          columnFilters={columnFilters}
          columnSizing={columnSizing}
          resizingColumnId={resizingColumnId}
          rowCount={rowCount}
          sorting={sorting}
          onStartSelection={onStartSelection}
          onExtendSelection={onExtendSelection}
          onOpenMenu={onOpenMenu}
        />
      ))}
      {virtualColumns.map((virtualColumn) => {
        const header = centerHeaders[virtualColumn.index]
        return (
          <HeaderCell
            key={header.id}
            header={header}
            left={virtualColumn.start}
            table={table}
            bounds={selectionBounds}
            columnFilters={columnFilters}
            columnSizing={columnSizing}
            resizingColumnId={resizingColumnId}
            rowCount={rowCount}
            sorting={sorting}
            onStartSelection={onStartSelection}
            onExtendSelection={onExtendSelection}
            onOpenMenu={onOpenMenu}
          />
        )
      })}
      {endHeaders.map((header) => (
        <HeaderCell
          key={header.id}
          header={header}
          pinned="end"
          table={table}
          bounds={selectionBounds}
          columnFilters={columnFilters}
          columnSizing={columnSizing}
          resizingColumnId={resizingColumnId}
          rowCount={rowCount}
          sorting={sorting}
          onStartSelection={onStartSelection}
          onExtendSelection={onExtendSelection}
          onOpenMenu={onOpenMenu}
        />
      ))}
    </div>
  )
}

interface HeaderCellProps {
  header: SpreadsheetTableHeader
  table: SpreadsheetTable
  bounds: Array<CellSelectionBounds>
  columnFilters: SpreadsheetTable['state']['columnFilters']
  columnSizing: SpreadsheetTable['state']['columnSizing']
  resizingColumnId: false | string
  rowCount: number
  sorting: SpreadsheetTable['state']['sorting']
  onStartSelection: HeaderRowProps['onStartSelection']
  onExtendSelection: HeaderRowProps['onExtendSelection']
  left?: number
  pinned?: 'start' | 'end'
  onOpenMenu: (column: SpreadsheetTableColumn, rect: DOMRect) => void
}

function HeaderCell({
  header,
  table,
  bounds,
  columnFilters,
  columnSizing,
  resizingColumnId,
  rowCount,
  sorting,
  onStartSelection,
  onExtendSelection,
  left,
  pinned,
  onOpenMenu,
}: HeaderCellProps) {
  const { column } = header
  const columnIndex = table.getCellSelectionColumnIndexes()[column.id] ?? -1
  const fullySelected = bounds.some(
    (bound) =>
      bound.minRowIndex === 0 &&
      bound.maxRowIndex === rowCount - 1 &&
      columnIndex >= bound.minColumnIndex &&
      columnIndex <= bound.maxColumnIndex,
  )
  const meta = column.columnDef.meta
  const sort = sorting.find((entry) => entry.id === column.id)
  const sorted = sort ? (sort.desc ? 'desc' : 'asc') : false
  const filtered = columnFilters.some((filter) => filter.id === column.id)
  const style = getColumnPositionStyle(column, columnSizing, left, pinned)

  return (
    <div
      className={[
        'column-header',
        pinned && 'column-pinned',
        fullySelected && 'header-selected',
      ]
        .filter(Boolean)
        .join(' ')}
      role="columnheader"
      aria-colindex={columnIndex + 1}
      aria-selected={fullySelected}
      style={style}
      onMouseDown={(event) =>
        onStartSelection(event, 'column', column.id, fullySelected)
      }
      onMouseEnter={() => onExtendSelection('column', column.id)}
    >
      <span className="column-letter">{meta?.letter}</span>
      <button
        type="button"
        className={[
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
        className={[
          'column-resizer',
          resizingColumnId === column.id && 'column-resizer-active',
        ]
          .filter(Boolean)
          .join(' ')}
        role="separator"
        aria-label={`Resize column ${meta?.letter}`}
        onDoubleClick={(event) => {
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
  columnSizing: SpreadsheetTable['state']['columnSizing']
  virtualColumns: Array<VirtualItem>
  interactions: GridInteractions
  onStartHeaderSelection: (
    event: React.MouseEvent<HTMLElement>,
    axis: 'row',
    id: string,
    fullySelected: boolean,
  ) => void
  onExtendHeaderSelection: (axis: 'row', id: string) => void
  fillPreview: FillPreview | null
  onStartFill: (event: React.MouseEvent, source: GridBounds) => void
  onOpenContextMenu: (
    x: number,
    y: number,
    column: SpreadsheetTableColumn,
  ) => void
}

interface RowSelectionSnapshot {
  activeBound?: CellSelectionBounds
  focusedColumnId?: string
  fullySelected: boolean
  key: string
}

function SubscribedRow(props: SubscribedRowProps) {
  const { row, table } = props
  return (
    <table.Subscribe
      source={table.atoms.cellSelection}
      selector={(ranges) => {
        const bounds = table.getCellSelectionBounds()
        const rowIndex = row.getDisplayIndex()
        const activeRange = ranges.at(-1)
        const activeBound = bounds.at(-1)
        const columnCount =
          table.getStartVisibleLeafColumns().length +
          table.getCenterVisibleLeafColumns().length +
          table.getEndVisibleLeafColumns().length

        return {
          activeBound:
            activeBound?.maxRowIndex === rowIndex ? activeBound : undefined,
          focusedColumnId:
            activeRange?.anchorRowId === row.id
              ? activeRange.anchorColumnId
              : undefined,
          fullySelected: bounds.some(
            (bound) =>
              bound.minColumnIndex === 0 &&
              bound.maxColumnIndex === columnCount - 1 &&
              rowIndex >= bound.minRowIndex &&
              rowIndex <= bound.maxRowIndex,
          ),
          key: rowSelectionKey(ranges, bounds, rowIndex, row.id),
        }
      }}
    >
      {(selection) => <SpreadsheetRowView {...props} selection={selection} />}
    </table.Subscribe>
  )
}

function SpreadsheetRowView({
  row,
  top,
  frozen,
  table,
  columnSizing,
  virtualColumns,
  interactions,
  onStartHeaderSelection,
  onExtendHeaderSelection,
  fillPreview,
  onStartFill,
  onOpenContextMenu,
  selection,
}: SubscribedRowProps & { selection: RowSelectionSnapshot }) {
  const rowIndex = row.getDisplayIndex()
  const centerCells = row.getCenterVisibleCells()
  const startCells = row.getStartVisibleCells()
  const endCells = row.getEndVisibleCells()

  return (
    <div
      className={[
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
        height: ROW_HEIGHT,
        transform: `translateY(${top}px)`,
      }}
    >
      <button
        type="button"
        className={
          selection.fullySelected ? 'row-header header-selected' : 'row-header'
        }
        aria-label={`Select row ${rowIndex + 1}`}
        aria-selected={selection.fullySelected}
        onMouseDown={(event) =>
          onStartHeaderSelection(event, 'row', row.id, selection.fullySelected)
        }
        onMouseEnter={() => onExtendHeaderSelection('row', row.id)}
      >
        {rowIndex + 1}
      </button>
      {startCells.map((cell) => {
        if (cell.getRowSpan() !== 1 || cell.getColSpan() !== 1) {
          return null
        }
        return (
          <SpreadsheetCell
            key={cell.id}
            cell={cell}
            rowIndex={rowIndex}
            selection={selection}
            fillPreview={fillPreview}
            pinned="start"
            table={table}
            columnSizing={columnSizing}
            interactions={interactions}
            onStartFill={onStartFill}
            onOpenContextMenu={onOpenContextMenu}
          />
        )
      })}
      {virtualColumns.map((virtualColumn) => {
        const cell = centerCells[virtualColumn.index]
        // Cells that take part in a merge render in the merged-cell overlay:
        // the anchor as one large cell, the covered cells not at all. Merges
        // never include pinned rows or columns, so the pinned loops above and
        // below stay untouched.
        if (cell.getRowSpan() !== 1 || cell.getColSpan() !== 1) {
          return null
        }
        return (
          <SpreadsheetCell
            key={cell.id}
            cell={cell}
            rowIndex={rowIndex}
            selection={selection}
            fillPreview={fillPreview}
            left={virtualColumn.start}
            table={table}
            columnSizing={columnSizing}
            interactions={interactions}
            onStartFill={onStartFill}
            onOpenContextMenu={onOpenContextMenu}
          />
        )
      })}
      {endCells.map((cell) => {
        if (cell.getRowSpan() !== 1 || cell.getColSpan() !== 1) {
          return null
        }
        return (
          <SpreadsheetCell
            key={cell.id}
            cell={cell}
            rowIndex={rowIndex}
            selection={selection}
            fillPreview={fillPreview}
            pinned="end"
            table={table}
            columnSizing={columnSizing}
            interactions={interactions}
            onStartFill={onStartFill}
            onOpenContextMenu={onOpenContextMenu}
          />
        )
      })}
    </div>
  )
}

interface SpreadsheetCellProps {
  cell: SpreadsheetTableCell
  rowIndex: number
  selection: RowSelectionSnapshot
  fillPreview: FillPreview | null
  table: SpreadsheetTable
  columnSizing: SpreadsheetTable['state']['columnSizing']
  interactions: GridInteractions
  left?: number
  pinned?: 'start' | 'end'
  onStartFill: (event: React.MouseEvent, source: GridBounds) => void
  onOpenContextMenu: (
    x: number,
    y: number,
    column: SpreadsheetTableColumn,
  ) => void
}

function SpreadsheetCell({
  cell,
  rowIndex,
  selection,
  fillPreview,
  table,
  columnSizing,
  interactions,
  left,
  pinned,
  onStartFill,
  onOpenContextMenu,
}: SpreadsheetCellProps) {
  const columnIndex =
    table.getCellSelectionColumnIndexes()[cell.column.id] ?? -1
  const { edges, isFocused, isSelected, tabIndex } =
    getCellSelectionRenderState(cell, selection)
  const fillTarget =
    fillPreview &&
    isWithinBounds(fillPreview.destination, rowIndex, columnIndex)
  const activeBound = selection.activeBound
  const showFillHandle =
    activeBound &&
    rowIndex === activeBound.maxRowIndex &&
    columnIndex === activeBound.maxColumnIndex
  const isEditing =
    interactions.editing?.rowId === cell.row.id &&
    interactions.editing.columnId === cell.column.id
  const className = [
    'spreadsheet-cell',
    pinned && 'cell-pinned',
    isSelected && 'cell-selected',
    isFocused && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
    fillTarget && 'cell-fill-preview',
    cell.row.original.kind === 'field-header' && 'cell-field-header',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      role="gridcell"
      aria-colindex={columnIndex + 1}
      aria-selected={isSelected}
      data-sheet-cell
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      tabIndex={isEditing ? -1 : tabIndex}
      style={getColumnPositionStyle(cell.column, columnSizing, left, pinned)}
      onMouseDown={(event) => {
        if (isEditing || event.button !== 0) return
        const grid =
          event.currentTarget.closest<HTMLElement>('.spreadsheet-grid')
        grid?.focus({ preventScroll: true })
        cell.getSelectionStartHandler(document)(event)
      }}
      onMouseEnter={cell.getSelectionExtendHandler()}
      onDoubleClick={() =>
        interactions.startEditing(cell.row.id, cell.column.id)
      }
      onContextMenu={(event) => {
        event.preventDefault()
        event.currentTarget
          .closest<HTMLElement>('.spreadsheet-grid')
          ?.focus({ preventScroll: true })
        onOpenContextMenu(event.clientX, event.clientY, cell.column)
      }}
    >
      {isEditing ? (
        <input
          autoFocus
          className="cell-editor"
          aria-label={`Edit ${cell.column.columnDef.meta?.letter}${rowIndex + 1}`}
          value={interactions.editing?.draft ?? ''}
          onFocus={(event) => event.currentTarget.select()}
          onMouseDown={(event) => event.stopPropagation()}
          onChange={(event) => interactions.setEditingDraft(event.target.value)}
          onKeyDown={interactions.handleEditorKeyDown}
          onBlur={() => interactions.commitEditing()}
        />
      ) : (
        <span className="cell-value">
          {formatRenderedValue(cell.getValue())}
        </span>
      )}
      {showFillHandle ? (
        <span
          className="fill-handle"
          data-testid="fill-handle"
          aria-label="Drag to fill"
          onMouseDown={(event) =>
            onStartFill(event, {
              minRowIndex: activeBound.minRowIndex,
              maxRowIndex: activeBound.maxRowIndex,
              minColumnIndex: activeBound.minColumnIndex,
              maxColumnIndex: activeBound.maxColumnIndex,
            })
          }
        />
      ) : null}
    </div>
  )
}

interface MergedCellsOverlayProps {
  table: SpreadsheetTable
  cellSelection: CellSelectionState
  columnSizing: SpreadsheetTable['state']['columnSizing']
  interactions: GridInteractions
  topRowCount: number
  frozenRowsHeight: number
  startWidth: number
  clipLayerRef: React.RefObject<HTMLDivElement | null>
  onOpenContextMenu: (
    x: number,
    y: number,
    column: SpreadsheetTableColumn,
  ) => void
}

/**
 * Renders every merged cell as one absolutely positioned cell in canvas
 * coordinates, independent of both virtualizers.
 *
 * Anchors and covered cells are skipped by the per-row loops, so a merge whose
 * anchor row scrolls out of the virtual window still renders here: the browser
 * clips the overlay against the scroll container instead of the row window.
 * Rows are fixed-height and merges never include pinned rows or columns, so a
 * merge's rectangle is computable directly from its position in the span
 * index without consulting virtual items.
 */
function MergedCellsOverlay({
  table,
  cellSelection,
  columnSizing,
  interactions,
  topRowCount,
  frozenRowsHeight,
  startWidth,
  clipLayerRef,
  onOpenContextMenu,
}: MergedCellsOverlayProps) {
  const spanIndex = table.getCellSpanIndex()
  const startColumns = table.getStartVisibleLeafColumns()
  const centerColumns = table.getCenterVisibleLeafColumns()
  const endColumns = table.getEndVisibleLeafColumns()

  const columnsByPosition: Array<SpreadsheetTableColumn | undefined> = []
  for (const column of [...startColumns, ...centerColumns, ...endColumns]) {
    columnsByPosition[spanIndex.columnIndexes[column.id]] = column
  }

  const centerOffsets = new Map<string, number>()
  let offset = 0
  for (const column of centerColumns) {
    centerOffsets.set(column.id, offset)
    offset += getColumnSize(column, columnSizing)
  }

  type MergedAnchor = {
    cell: SpreadsheetTableCell
    rowSpan: number
    colSpan: number
    top: number
    left: number
    width: number
    height: number
  }

  const centerAnchors: Array<MergedAnchor> = []
  const pinnedAnchors: Array<MergedAnchor> = []

  const pushAnchor = (columnId: string, r: number, rowSpan: number) => {
    const row = spanIndex.rows[r]
    const cell = row.getAllCellsByColumnId()[columnId]
    const pinned = cell.column.getIsPinned()
    // The example only freezes leading columns, so end-pinned anchors have no
    // render path and are skipped.
    if (pinned === 'end') return

    const colSpan = Math.max(cell.getColSpan(), 1)
    let width = 0
    const position = spanIndex.columnIndexes[columnId] ?? -1
    for (let c = 0; c < colSpan; c++) {
      const column = columnsByPosition[position + c]
      width += column ? getColumnSize(column, columnSizing) : 0
    }

    const rowOffset = (r - topRowCount) * ROW_HEIGHT
    const height = rowSpan * ROW_HEIGHT

    if (pinned === 'start') {
      // The sticky layer sits at the header + frozen-rows flow offset and
      // sticks horizontally, so children use layer-local tops and the same
      // viewport inset the pinned cells use.
      pinnedAnchors.push({
        cell,
        rowSpan,
        colSpan,
        top: rowOffset,
        left: ROW_HEADER_WIDTH + cell.column.getStart('start'),
        width,
        height,
      })
      return
    }

    const columnOffset = centerOffsets.get(columnId)
    if (columnOffset === undefined) return

    centerAnchors.push({
      cell,
      rowSpan,
      colSpan,
      top: HEADER_HEIGHT + frozenRowsHeight + rowOffset,
      left: ROW_HEADER_WIDTH + startWidth + columnOffset,
      width,
      height,
    })
  }

  // Vertical runs and full rectangles anchor in the row-span index.
  for (const columnId in spanIndex.rowSpans) {
    const spans = spanIndex.rowSpans[columnId]
    for (let r = 0; r < spans.length; r++) {
      const rowSpan = spans[r]
      if (rowSpan > 1) pushAnchor(columnId, r, rowSpan)
    }
  }

  // Horizontal-only merges never enter the row-span index, so collect them
  // from the column spans, skipping anchors the pass above already emitted.
  if (spanIndex.colSpans.length) {
    const columnIdBySpanIndex: Array<string | undefined> = []
    for (const columnId in spanIndex.columnIndexes) {
      columnIdBySpanIndex[spanIndex.columnIndexes[columnId]] = columnId
    }

    for (let r = 0; r < spanIndex.colSpans.length; r++) {
      const rowColSpans = spanIndex.colSpans[r]
      if (!rowColSpans) continue

      for (let c = 0; c < rowColSpans.length; c++) {
        if (rowColSpans[c] <= 1) continue

        const columnId = columnIdBySpanIndex[c]
        if (columnId === undefined) continue

        const vertical = spanIndex.rowSpans[columnId] as Int32Array | undefined
        if (vertical && vertical[r] !== 1) continue

        pushAnchor(columnId, r, 1)
      }
    }
  }

  return (
    <>
      <div ref={clipLayerRef} className="merge-layer">
        {centerAnchors.map((anchor) => (
          <MergedCellView
            key={anchor.cell.id}
            anchor={anchor}
            cellSelection={cellSelection}
            interactions={interactions}
            onOpenContextMenu={onOpenContextMenu}
          />
        ))}
      </div>
      {pinnedAnchors.length ? (
        <div className="pinned-merge-layer">
          {pinnedAnchors.map((anchor) => (
            <MergedCellView
              key={anchor.cell.id}
              anchor={anchor}
              cellSelection={cellSelection}
              interactions={interactions}
              onOpenContextMenu={onOpenContextMenu}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

function MergedCellView({
  anchor,
  cellSelection,
  interactions,
  onOpenContextMenu,
}: {
  anchor: {
    cell: SpreadsheetTableCell
    rowSpan: number
    colSpan: number
    top: number
    left: number
    width: number
    height: number
  }
  cellSelection: CellSelectionState
  interactions: GridInteractions
  onOpenContextMenu: MergedCellsOverlayProps['onOpenContextMenu']
}) {
  const { cell } = anchor
  const { edges, isFocused, isSelected, tabIndex } =
    getCellSelectionRenderState(cell, cellSelection)
  const isEditing =
    interactions.editing?.rowId === cell.row.id &&
    interactions.editing.columnId === cell.column.id
  const className = [
    'spreadsheet-cell',
    'cell-merged',
    isSelected && 'cell-selected',
    isFocused && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      role="gridcell"
      aria-selected={isSelected}
      aria-rowspan={anchor.rowSpan}
      aria-colspan={anchor.colSpan}
      data-sheet-cell
      data-merged-cell
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      tabIndex={isEditing ? -1 : tabIndex}
      style={{
        top: anchor.top,
        left: anchor.left,
        width: anchor.width,
        height: anchor.height,
      }}
      onMouseDown={(event) => {
        if (isEditing || event.button !== 0) return
        const grid =
          event.currentTarget.closest<HTMLElement>('.spreadsheet-grid')
        grid?.focus({ preventScroll: true })
        cell.getSelectionStartHandler(document)(event)
      }}
      onMouseEnter={cell.getSelectionExtendHandler()}
      onDoubleClick={() =>
        interactions.startEditing(cell.row.id, cell.column.id)
      }
      onContextMenu={(event) => {
        event.preventDefault()
        event.currentTarget
          .closest<HTMLElement>('.spreadsheet-grid')
          ?.focus({ preventScroll: true })
        onOpenContextMenu(event.clientX, event.clientY, cell.column)
      }}
    >
      {isEditing ? (
        <input
          autoFocus
          className="cell-editor"
          aria-label={`Edit merged cell ${cell.column.columnDef.meta?.letter}`}
          value={interactions.editing?.draft ?? ''}
          onFocus={(event) => event.currentTarget.select()}
          onMouseDown={(event) => event.stopPropagation()}
          onChange={(event) => interactions.setEditingDraft(event.target.value)}
          onKeyDown={interactions.handleEditorKeyDown}
          onBlur={() => interactions.commitEditing()}
        />
      ) : (
        <span className="cell-value">
          {formatRenderedValue(cell.getValue())}
        </span>
      )}
    </div>
  )
}

function getCellSelectionRenderState(
  cell: SpreadsheetTableCell,
  selection: RowSelectionSnapshot | CellSelectionState,
) {
  const activeRange = Array.isArray(selection) ? selection.at(-1) : undefined
  const focusedColumnId = Array.isArray(selection)
    ? activeRange?.anchorRowId === cell.row.id
      ? activeRange.anchorColumnId
      : undefined
    : selection.focusedColumnId
  const isFocused = focusedColumnId === cell.column.id

  return {
    edges: cell.getSelectionEdges(),
    isFocused,
    isSelected: cell.getIsSelected(),
    tabIndex: isFocused ? 0 : -1,
  }
}

function getColumnPositionStyle(
  column: SpreadsheetTableColumn,
  columnSizing: SpreadsheetTable['state']['columnSizing'],
  left?: number,
  pinned?: 'start' | 'end',
): React.CSSProperties {
  const width = getColumnSize(column, columnSizing)
  if (pinned === 'start') {
    return {
      width,
      insetInlineStart: ROW_HEADER_WIDTH + column.getStart('start'),
    }
  }
  if (pinned === 'end') {
    return {
      width,
      insetInlineEnd: column.getAfter('end'),
    }
  }
  return { width, left }
}

function getColumnSize(
  column: SpreadsheetTableColumn | undefined,
  columnSizing: SpreadsheetTable['state']['columnSizing'],
  fallback = 150,
) {
  if (!column) return fallback

  return Math.min(
    Math.max(
      column.columnDef.minSize ?? 20,
      (Object.hasOwn(columnSizing, column.id)
        ? columnSizing[column.id]
        : undefined) ??
        column.columnDef.size ??
        fallback,
    ),
    column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER,
  )
}

function rowSelectionKey(
  ranges: CellSelectionState,
  bounds: Array<CellSelectionBounds>,
  rowIndex: number,
  rowId: string,
) {
  const active = ranges.at(-1)
  let key = active?.anchorRowId === rowId ? `f${active.anchorColumnId}` : ''

  for (const bound of bounds) {
    const self = rowIndex >= bound.minRowIndex && rowIndex <= bound.maxRowIndex
    const above =
      rowIndex - 1 >= bound.minRowIndex && rowIndex - 1 <= bound.maxRowIndex
    const below =
      rowIndex + 1 >= bound.minRowIndex && rowIndex + 1 <= bound.maxRowIndex

    if (self || above || below) {
      key += `|${self ? 1 : 0}${above ? 1 : 0}${below ? 1 : 0}:${bound.minColumnIndex}-${bound.maxColumnIndex}`
    }
  }

  return key
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
