import React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CellContextMenu } from './CellContextMenu'
import { ColumnMenu } from './ColumnMenu'
import { getFillPreview } from './spreadsheetModel'
import type {
  CellSelectionBounds,
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
const EDGE_SCROLL_ZONE = 32
const MAX_EDGE_SCROLL_SPEED = 22

interface SpreadsheetGridProps {
  table: SpreadsheetTable
  interactions: GridInteractions
  zoom: number
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

export const SpreadsheetGrid = React.forwardRef<
  SpreadsheetGridHandle,
  SpreadsheetGridProps
>(function SpreadsheetGrid({ table, interactions, zoom }, forwardedRef) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const startColumns = table.getStartVisibleLeafColumns()
  const centerColumns = table.getCenterVisibleLeafColumns()
  const endColumns = table.getEndVisibleLeafColumns()
  const topRows = table.getTopRows()
  const centerRows = table.getCenterRows()
  const startWidth = startColumns.reduce(
    (total, column) => total + column.getSize(),
    0,
  )
  const endWidth = endColumns.reduce(
    (total, column) => total + column.getSize(),
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
    estimateSize: (index) => centerColumns[index]?.getSize() ?? 120,
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

  const [openMenu, setOpenMenu] = React.useState<OpenColumnMenu | null>(null)
  const [openCellMenu, setOpenCellMenu] = React.useState<OpenCellMenu | null>(
    null,
  )
  const [fillPreview, setFillPreview] = React.useState<FillPreview | null>(null)
  const fillDragRef = React.useRef<FillDrag | null>(null)
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

      if (!table._isSelectingCells) return
      const row = table.getRowsInDisplayOrder()[coordinate.rowIndex]
      const column = getDisplayColumns()[coordinate.columnIndex]
      row.getAllCellsByColumnId()[column.id].getSelectionExtendHandler()(event)
    },
    [getDisplayColumns, resolveCoordinate, table],
  )

  const runEdgeScroll = React.useCallback(() => {
    scrollFrameRef.current = null
    if (!fillDragRef.current && !table._isSelectingCells) return

    const element = scrollRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const { clientX, clientY } = pointerRef.current
    const topBoundary = rect.top + HEADER_HEIGHT + frozenRowsHeight
    const leftBoundary = rect.left + ROW_HEADER_WIDTH + startWidth
    const rightBoundary = rect.right - endWidth

    const deltaX = edgeDelta(
      clientX,
      leftBoundary,
      rightBoundary,
      EDGE_SCROLL_ZONE,
    )
    const deltaY = edgeDelta(
      clientY,
      topBoundary,
      rect.bottom,
      EDGE_SCROLL_ZONE,
    )

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

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      }
      if (fillDragRef.current || table._isSelectingCells) {
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
        onKeyDown={interactions.handleGridKeyDown}
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
          <table.Subscribe source={table.atoms.cellSelection}>
            {() => (
              <HeaderRow
                table={table}
                virtualColumns={virtualColumns}
                centerHeaders={table.getCenterLeafHeaders()}
                startHeaders={table.getStartLeafHeaders()}
                endHeaders={table.getEndLeafHeaders()}
                interactions={interactions}
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
                  virtualColumns={virtualColumns}
                  interactions={interactions}
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
                virtualColumns={virtualColumns}
                interactions={interactions}
                fillPreview={fillPreview}
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
  virtualColumns: Array<VirtualItem>
  centerHeaders: Array<SpreadsheetTableHeader>
  startHeaders: Array<SpreadsheetTableHeader>
  endHeaders: Array<SpreadsheetTableHeader>
  interactions: GridInteractions
  onOpenMenu: (column: SpreadsheetTableColumn, rect: DOMRect) => void
}

function HeaderRow({
  table,
  virtualColumns,
  centerHeaders,
  startHeaders,
  endHeaders,
  interactions,
  onOpenMenu,
}: HeaderRowProps) {
  const bounds = table.getCellSelectionBounds()
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
          bounds={bounds}
          rowCount={rowCount}
          interactions={interactions}
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
            bounds={bounds}
            rowCount={rowCount}
            interactions={interactions}
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
          bounds={bounds}
          rowCount={rowCount}
          interactions={interactions}
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
  rowCount: number
  interactions: GridInteractions
  left?: number
  pinned?: 'start' | 'end'
  onOpenMenu: (column: SpreadsheetTableColumn, rect: DOMRect) => void
}

function HeaderCell({
  header,
  table,
  bounds,
  rowCount,
  interactions,
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
  const sorted = column.getIsSorted()
  const filtered = column.getIsFiltered()
  const style = getColumnPositionStyle(column, left, pinned)

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
      onClick={(event) => interactions.selectColumn(column.id, event)}
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
          column.getIsResizing() && 'column-resizer-active',
        ]
          .filter(Boolean)
          .join(' ')}
        role="separator"
        aria-label={`Resize column ${meta?.letter}`}
        onDoubleClick={(event) => {
          event.stopPropagation()
          column.resetSize()
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
  fillPreview: FillPreview | null
  onStartFill: (event: React.MouseEvent, source: GridBounds) => void
  onOpenContextMenu: (
    x: number,
    y: number,
    column: SpreadsheetTableColumn,
  ) => void
}

function SubscribedRow(props: SubscribedRowProps) {
  const { row, table } = props
  return (
    <table.Subscribe
      source={table.atoms.cellSelection}
      selector={(ranges) =>
        rowSelectionKey(
          ranges,
          table.getCellSelectionBounds(),
          row.getDisplayIndex(),
          row.id,
        )
      }
    >
      {() => <SpreadsheetRowView {...props} />}
    </table.Subscribe>
  )
}

function SpreadsheetRowView({
  row,
  top,
  frozen,
  table,
  virtualColumns,
  interactions,
  fillPreview,
  onStartFill,
  onOpenContextMenu,
}: SubscribedRowProps) {
  const rowIndex = row.getDisplayIndex()
  const bounds = table.getCellSelectionBounds()
  const activeBound = bounds.at(-1)
  const centerCells = row.getCenterVisibleCells()
  const startCells = row.getStartVisibleCells()
  const endCells = row.getEndVisibleCells()
  const fullySelected = bounds.some(
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
        className={fullySelected ? 'row-header header-selected' : 'row-header'}
        aria-label={`Select row ${rowIndex + 1}`}
        aria-selected={fullySelected}
        onClick={(event) => interactions.selectRow(row.id, event)}
      >
        {rowIndex + 1}
      </button>
      {startCells.map((cell) => (
        <SpreadsheetCell
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex}
          activeBound={activeBound}
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
            key={cell.id}
            cell={cell}
            rowIndex={rowIndex}
            activeBound={activeBound}
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
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex}
          activeBound={activeBound}
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
  activeBound?: CellSelectionBounds
  fillPreview: FillPreview | null
  table: SpreadsheetTable
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
  activeBound,
  fillPreview,
  table,
  interactions,
  left,
  pinned,
  onStartFill,
  onOpenContextMenu,
}: SpreadsheetCellProps) {
  const columnIndex =
    table.getCellSelectionColumnIndexes()[cell.column.id] ?? -1
  const edges = cell.getSelectionEdges()
  const fillTarget =
    fillPreview &&
    isWithinBounds(fillPreview.destination, rowIndex, columnIndex)
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
    cell.getIsSelected() && 'cell-selected',
    cell.getIsFocused() && 'cell-focused',
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
      aria-selected={cell.getIsSelected()}
      data-sheet-cell
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      tabIndex={isEditing ? -1 : cell.getTabIndex()}
      style={getColumnPositionStyle(cell.column, left, pinned)}
      onMouseDown={(event) => {
        if (isEditing) return
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
        if (!cell.getIsSelected()) {
          table.setFocusedCell(cell.row.id, cell.column.id)
        }
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

function getColumnPositionStyle(
  column: SpreadsheetTableColumn,
  left?: number,
  pinned?: 'start' | 'end',
): React.CSSProperties {
  if (pinned === 'start') {
    return {
      width: column.getSize(),
      insetInlineStart: ROW_HEADER_WIDTH + column.getStart('start'),
    }
  }
  if (pinned === 'end') {
    return {
      width: column.getSize(),
      insetInlineEnd: column.getAfter('end'),
    }
  }
  return { width: column.getSize(), left }
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
