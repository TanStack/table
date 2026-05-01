import { memo, useMemo, useRef } from 'react'
import TableRow from '@mui/material/TableRow'
import { alpha, darken, lighten, useTheme } from '@mui/material/styles'
import { getIsRowSelected } from '../../utils/row.utils'
import {
  commonCellBeforeAfterStyles,
  getCommonPinnedCellStyles,
} from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableDetailPanel } from './MRT_TableDetailPanel'
import { MRT_TableBodyCell, Memo_MRT_TableBodyCell } from './MRT_TableBodyCell'
import type {
  MRT_Cell,
  MRT_ColumnVirtualizer,
  MRT_Row,
  MRT_RowData,
  MRT_RowVirtualizer,
  MRT_TableInstance,
  MRT_VirtualItem,
} from '../../types'
import type { Theme } from '@mui/material/styles'
import type { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'
import type { DragEvent } from 'react'

export interface MRT_TableBodyRowProps<
  TData extends MRT_RowData,
> extends TableRowProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  numRows?: number
  pinnedRowIds?: Array<string>
  row: MRT_Row<TData>
  rowVirtualizer?: MRT_RowVirtualizer
  staticRowIndex: number
  table: MRT_TableInstance<TData>
  virtualRow?: VirtualItem
}

export const MRT_TableBodyRow = <TData extends MRT_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  ...rest
}: MRT_TableBodyRowProps<TData>) => {
  const theme = useTheme()

  const {
    state,
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      memoMode,
      mrtTheme: {
        baseBackgroundColor,
        pinnedRowBackgroundColor,
        selectedRowBackgroundColor,
      },
      muiTableBodyRowProps,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
    setHoveredRow,
  } = table
  const {
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredRow,
    isFullScreen,
    rowPinning,
  } = state

  const visibleCells = row.getVisibleCells()

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {}

  const isRowSelected = getIsRowSelected({ row, table })
  const isRowPinned = enableRowPinning && row.getIsPinned()
  const isDraggingRow = draggingRow?.id === row.id
  const isHoveredRow = hoveredRow?.id === row.id

  const tableRowProps = {
    ...parseFromValuesOrFunc(muiTableBodyRowProps, {
      row,
      staticRowIndex,
      table,
    }),
    ...rest,
  }

  const [bottomPinnedIndex, topPinnedIndex] = useMemo(() => {
    if (
      !enableRowPinning ||
      !rowPinningDisplayMode?.includes('sticky') ||
      !pinnedRowIds ||
      !row.getIsPinned()
    )
      return []
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ]
  }, [pinnedRowIds, rowPinning])

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0

  const sx = parseFromValuesOrFunc(tableRowProps?.sx, theme as any)

  const defaultRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69

  const customRowHeight =
    // @ts-expect-error
    parseInt(tableRowProps?.style?.height ?? sx?.height, 10) || undefined

  const rowHeight = customRowHeight || defaultRowHeight

  const handleDragEnter = (_e: DragEvent) => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const rowRef = useRef<HTMLTableRowElement | null>(null)

  const cellHighlightColor = isRowSelected
    ? selectedRowBackgroundColor
    : isRowPinned
      ? pinnedRowBackgroundColor
      : undefined

  const cellHighlightColorHover =
    tableRowProps?.hover !== false
      ? isRowSelected
        ? cellHighlightColor
        : theme.palette.mode === 'dark'
          ? `${lighten(baseBackgroundColor, 0.3)}`
          : `${darken(baseBackgroundColor, 0.3)}`
      : undefined

  return (
    <>
      <TableRow
        data-index={renderDetailPanel ? staticRowIndex * 2 : staticRowIndex}
        data-pinned={!!isRowPinned || undefined}
        data-selected={isRowSelected || undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        ref={(node: HTMLTableRowElement) => {
          if (node) {
            rowRef.current = node
            rowVirtualizer?.measureElement(node)
          }
        }}
        selected={isRowSelected}
        {...tableRowProps}
        style={{
          transform: virtualRow
            ? `translateY(${virtualRow.start}px)`
            : undefined,
          ...tableRowProps?.style,
        }}
        sx={(theme: Theme) => ({
          '&:hover td:after': cellHighlightColorHover
            ? {
                backgroundColor: alpha(cellHighlightColorHover, 0.3),
                ...commonCellBeforeAfterStyles,
              }
            : undefined,
          backgroundColor: `${baseBackgroundColor} !important`,
          bottom:
            !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
              ? `${
                  bottomPinnedIndex * rowHeight +
                  (enableStickyFooter ? tableFooterHeight - 1 : 0)
                }px`
              : undefined,
          boxSizing: 'border-box',
          display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
          opacity: isRowPinned ? 0.97 : isDraggingRow || isHoveredRow ? 0.5 : 1,
          position: virtualRow
            ? 'absolute'
            : rowPinningDisplayMode?.includes('sticky') && isRowPinned
              ? 'sticky'
              : 'relative',
          td: {
            ...getCommonPinnedCellStyles({ table, theme }),
          },
          'td:after': cellHighlightColor
            ? {
                backgroundColor: cellHighlightColor,
                ...commonCellBeforeAfterStyles,
              }
            : undefined,
          top: virtualRow
            ? 0
            : topPinnedIndex !== undefined && isRowPinned
              ? `${
                  topPinnedIndex * rowHeight +
                  (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
                }px`
              : undefined,
          transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
          width: '100%',
          zIndex:
            rowPinningDisplayMode?.includes('sticky') && isRowPinned ? 2 : 0,
          ...(sx as any),
        })}
      >
        {virtualPaddingLeft ? (
          <td style={{ display: 'flex', width: virtualPaddingLeft }} />
        ) : null}
        {(virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as MRT_Cell<TData>
            if (columnVirtualizer) {
              staticColumnIndex = (cellOrVirtualCell as MRT_VirtualItem).index
              cell = visibleCells[staticColumnIndex]
            }
            const props = {
              cell,
              numRows,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            }
            const key = `${cell.id}-${staticRowIndex}`
            return cell ? (
              memoMode === 'cells' &&
              cell.column.columnDef.columnDefType === 'data' &&
              !draggingColumn &&
              !draggingRow &&
              editingCell?.id !== cell.id &&
              editingRow?.id !== row.id ? (
                <Memo_MRT_TableBodyCell key={key} {...props} />
              ) : (
                <MRT_TableBodyCell key={key} {...props} />
              )
            ) : null
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: 'flex', width: virtualPaddingRight }} />
        ) : null}
      </TableRow>
      {renderDetailPanel && !row.getIsGrouped() && (
        <MRT_TableDetailPanel
          parentRowRef={rowRef}
          row={row}
          rowVirtualizer={rowVirtualizer}
          staticRowIndex={staticRowIndex}
          table={table}
          virtualRow={virtualRow}
        />
      )}
    </>
  )
}

export const Memo_MRT_TableBodyRow = memo(
  MRT_TableBodyRow,
  (prev, next) =>
    prev.row === next.row && prev.staticRowIndex === next.staticRowIndex,
) as typeof MRT_TableBodyRow
