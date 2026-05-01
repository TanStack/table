import { useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { useTheme } from '@mui/material/styles'
import { getCommonMRTCellStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cellKeyboardShortcuts } from '../../utils/cell.utils'
import { MRT_TableHeadCellColumnActionsButton } from './MRT_TableHeadCellColumnActionsButton'
import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer'
import { MRT_TableHeadCellFilterLabel } from './MRT_TableHeadCellFilterLabel'
import { MRT_TableHeadCellGrabHandle } from './MRT_TableHeadCellGrabHandle'
import { MRT_TableHeadCellResizeHandle } from './MRT_TableHeadCellResizeHandle'
import { MRT_TableHeadCellSortLabel } from './MRT_TableHeadCellSortLabel'
import type {
  MRT_ColumnVirtualizer,
  MRT_Header,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { Theme } from '@mui/material/styles'
import type { DragEvent } from 'react'
import type { TableCellProps } from '@mui/material/TableCell'

export interface MRT_TableHeadCellProps<
  TData extends MRT_RowData,
> extends TableCellProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  header: MRT_Header<TData>
  staticColumnIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCell = <TData extends MRT_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
  ...rest
}: MRT_TableHeadCellProps<TData>) => {
  const theme = useTheme()
  const {
    state,
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableMultiSort,
      layoutMode,
      mrtTheme: { draggingBorderColor },
      muiTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table
  const {
    columnResizing,
    density,
    draggingColumn,
    grouping,
    hoveredColumn,
    showColumnFilters,
  } = state
  const { column } = header
  const { columnDef } = column
  const { columnDefType } = columnDef

  const tableCellProps = {
    ...parseFromValuesOrFunc(muiTableHeadCellProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.muiTableHeadCellProps, {
      column,
      table,
    }),
    ...rest,
  }

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned()

  const showColumnActions =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false

  const showDragHandle =
    enableColumnDragging !== false &&
    columnDef.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
      (enableGrouping &&
        columnDef.enableGrouping !== false &&
        !grouping.includes(column.id)))

  const headerPL = useMemo(() => {
    let pl = 0
    if (column.getCanSort()) pl += 1
    if (showColumnActions) pl += 1.75
    if (showDragHandle) pl += 1.5
    return pl
  }, [showColumnActions, showDragHandle])

  const draggingBorders = useMemo(() => {
    const showResizeBorder =
      columnResizing.isResizingColumn === column.id &&
      columnResizeMode === 'onChange' &&
      !header.subHeaders.length

    const borderStyle = showResizeBorder
      ? `2px solid ${draggingBorderColor} !important`
      : draggingColumn?.id === column.id
        ? `1px dashed ${theme.palette.grey[500]}`
        : hoveredColumn?.id === column.id
          ? `2px dashed ${draggingBorderColor}`
          : undefined

    if (showResizeBorder) {
      return columnResizeDirection === 'ltr'
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle }
    }
    const draggingBorders = borderStyle
      ? {
          borderLeft: borderStyle,
          borderRight: borderStyle,
          borderTop: borderStyle,
        }
      : undefined

    return draggingBorders
  }, [draggingColumn, hoveredColumn, columnResizing.isResizingColumn])

  const handleDragEnter = (_e: DragEvent) => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null)
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event)
    cellKeyboardShortcuts({
      event,
      cellValue: header.column.columnDef.header,
      table,
      header,
    })
  }

  const handleRef = useCallback(
    (node: HTMLTableCellElement) => {
      if (node) {
        if (tableHeadCellRefs.current) {
          tableHeadCellRefs.current[column.id] = node
        }
        if (columnDefType !== 'group') {
          columnVirtualizer?.measureElement?.(node)
        }
      }
    },
    [column.id, columnDefType, columnVirtualizer, tableHeadCellRefs],
  )

  const HeaderElement =
    parseFromValuesOrFunc(columnDef.Header, {
      column,
      header,
      table,
    }) ?? columnDef.header

  return (
    <TableCell
      align={
        columnDefType === 'group'
          ? 'center'
          : theme.direction === 'rtl'
            ? 'right'
            : 'left'
      }
      aria-sort={
        column.getIsSorted()
          ? column.getIsSorted() === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      colSpan={header.colSpan}
      data-can-sort={column.getCanSort() || undefined}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      data-sort={column.getIsSorted() || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      ref={handleRef}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      onKeyDown={handleKeyDown}
      sx={(theme: Theme) => ({
        '& :hover': {
          '.MuiButtonBase-root': {
            opacity: 1,
          },
        },
        flexDirection: layoutMode?.startsWith('grid') ? 'column' : undefined,
        fontWeight: 'bold',
        overflow: 'visible',
        p:
          density === 'compact'
            ? '0.5rem'
            : density === 'comfortable'
              ? columnDefType === 'display'
                ? '0.75rem'
                : '1rem'
              : columnDefType === 'display'
                ? '1rem 1.25rem'
                : '1.5rem',
        pb:
          columnDefType === 'display'
            ? 0
            : showColumnFilters || density === 'compact'
              ? '0.4rem'
              : '0.6rem',
        pt:
          columnDefType === 'group' || density === 'compact'
            ? '0.25rem'
            : density === 'comfortable'
              ? '.75rem'
              : '1.25rem',
        userSelect: enableMultiSort && column.getCanSort() ? 'none' : undefined,
        verticalAlign: 'top',
        ...getCommonMRTCellStyles({
          column,
          header,
          table,
          tableCellProps,
          theme,
        }),
        ...draggingBorders,
      })}
    >
      {header.isPlaceholder
        ? null
        : (tableCellProps.children ?? (
            <Box
              className="Mui-TableHeadCell-Content"
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection:
                  tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
                justifyContent:
                  columnDefType === 'group' ||
                  tableCellProps?.align === 'center'
                    ? 'center'
                    : column.getCanResize()
                      ? 'space-between'
                      : 'flex-start',
                position: 'relative',
                width: '100%',
              }}
            >
              <Box
                className="Mui-TableHeadCell-Content-Labels"
                onClick={column.getToggleSortingHandler()}
                sx={{
                  alignItems: 'center',
                  cursor:
                    column.getCanSort() && columnDefType !== 'group'
                      ? 'pointer'
                      : undefined,
                  display: 'flex',
                  flexDirection:
                    tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
                  overflow: columnDefType === 'data' ? 'hidden' : undefined,
                  pl:
                    tableCellProps?.align === 'center'
                      ? `${headerPL}rem`
                      : undefined,
                }}
              >
                <Box
                  className="Mui-TableHeadCell-Content-Wrapper"
                  sx={{
                    '&:hover': {
                      textOverflow: 'clip',
                    },
                    minWidth: `${Math.min(columnDef.header?.length ?? 0, 4)}ch`,
                    overflow: columnDefType === 'data' ? 'hidden' : undefined,
                    textOverflow: 'ellipsis',
                    whiteSpace:
                      (columnDef.header?.length ?? 0) < 20
                        ? 'nowrap'
                        : 'normal',
                  }}
                >
                  {HeaderElement}
                </Box>
                {column.getCanFilter() && (
                  <MRT_TableHeadCellFilterLabel header={header} table={table} />
                )}
                {column.getCanSort() && (
                  <MRT_TableHeadCellSortLabel header={header} table={table} />
                )}
              </Box>
              {columnDefType !== 'group' && (
                <Box
                  className="Mui-TableHeadCell-Content-Actions"
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {showDragHandle && (
                    <MRT_TableHeadCellGrabHandle
                      column={column}
                      table={table}
                      tableHeadCellRef={{
                        current: tableHeadCellRefs.current?.[column.id]!,
                      }}
                    />
                  )}
                  {showColumnActions && (
                    <MRT_TableHeadCellColumnActionsButton
                      header={header}
                      table={table}
                    />
                  )}
                </Box>
              )}
              {column.getCanResize() && (
                <MRT_TableHeadCellResizeHandle header={header} table={table} />
              )}
            </Box>
          ))}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <MRT_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </TableCell>
  )
}
