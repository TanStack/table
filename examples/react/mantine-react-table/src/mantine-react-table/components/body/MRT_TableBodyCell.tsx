import clsx from 'clsx'

import { memo, useEffect, useRef, useState } from 'react'

import { Skeleton, TableTd, useDirection } from '@mantine/core'

import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_CopyButton } from '../buttons/MRT_CopyButton'
import { MRT_EditCellTextInput } from '../inputs/MRT_EditCellTextInput'
import { MRT_TableBodyCellValue } from './MRT_TableBodyCellValue'
import classes from './MRT_TableBodyCell.module.css'
import type {
  MRT_Cell,
  MRT_CellValue,
  MRT_RowData,
  MRT_TableInstance,
  MRT_VirtualItem,
} from '../../types'
import type { CSSProperties, DragEvent, MouseEvent, RefObject } from 'react'
import type { TableTdProps } from '@mantine/core'

interface Props<
  TData extends MRT_RowData,
  TValue = MRT_CellValue,
> extends TableTdProps {
  cell: MRT_Cell<TData, TValue>
  numRows?: number
  renderedColumnIndex?: number
  renderedRowIndex?: number
  rowRef: RefObject<HTMLTableRowElement | null>
  table: MRT_TableInstance<TData>
  virtualCell?: MRT_VirtualItem
}

export const MRT_TableBodyCell = <TData extends MRT_RowData>({
  cell,
  numRows = 1,
  renderedColumnIndex = 0,
  renderedRowIndex = 0,
  rowRef,
  table,
  virtualCell,
  ...rest
}: Props<TData>) => {
  const direction = useDirection()

  const {
    state,
    options: {
      columnResizeDirection,
      columnResizeMode,
      createDisplayMode,
      editDisplayMode,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableEditing,
      enableGrouping,
      layoutMode,
      mantineSkeletonProps,
      mantineTableBodyCellProps,
    },
    refs: { editInputRefs },
    setEditingCell,
    setHoveredColumn,
  } = table
  const {
    columnResizing,
    creatingRow,
    density,
    draggingColumn,
    editingCell,
    editingRow,
    hoveredColumn,
    isLoading,
    showSkeletons,
  } = state
  const { column, row } = cell
  const { columnDef } = column
  const { columnDefType } = columnDef

  const args = {
    cell,
    column,
    renderedColumnIndex,
    renderedRowIndex,
    row,
    table,
  }
  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineTableBodyCellProps, args),
    ...parseFromValuesOrFunc(columnDef.mantineTableBodyCellProps, args),
    ...rest,
  }

  const skeletonProps = parseFromValuesOrFunc(mantineSkeletonProps, args)

  const [skeletonWidth, setSkeletonWidth] = useState(100)
  useEffect(() => {
    if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return
    const size = column.getSize()
    setSkeletonWidth(
      columnDefType === 'display'
        ? size / 2
        : Math.round(Math.random() * (size - size / 3) + size / 3),
    )
  }, [isLoading, showSkeletons])

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--col-${parseCSSVarId(
      column?.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--col-${parseCSSVarId(column.id)}-size) * 1px)`,
  }
  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--col-${parseCSSVarId(column.id)}-size)`
    } 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
  }
  const isDraggingColumn = draggingColumn?.id === column.id
  const isHoveredColumn = hoveredColumn?.id === column.id
  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned()

  const isEditable =
    !cell.getIsPlaceholder() &&
    parseFromValuesOrFunc(enableEditing, row) &&
    parseFromValuesOrFunc(columnDef.enableEditing, row) !== false

  const isEditing =
    isEditable &&
    !['custom', 'modal'].includes(editDisplayMode as string) &&
    (editDisplayMode === 'table' ||
      editingRow?.id === row.id ||
      editingCell?.id === cell.id) &&
    !row.getIsGrouped()

  const isCreating =
    isEditable && createDisplayMode === 'row' && creatingRow?.id === row.id

  const showClickToCopyButton =
    parseFromValuesOrFunc(enableClickToCopy, cell) ||
    (parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) &&
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) !== false)

  const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDoubleClick?.(event)
    if (isEditable && editDisplayMode === 'cell') {
      setEditingCell(cell)
      setTimeout(() => {
        const textField = editInputRefs.current[cell.id]
        if (textField) {
          textField.focus()
          textField.select?.()
        }
      }, 100)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDragEnter?.(e)
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null)
    }
    if (enableColumnOrdering && draggingColumn) {
      setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
    }
  }

  const cellValueProps = {
    cell,
    renderedColumnIndex,
    renderedRowIndex,
    table,
  }

  const cellHoverRevealDivRef = useRef<any>(null)
  const [isCellContentOverflowing, setIsCellContentOverflowing] =
    useState(false)

  const onMouseEnter = () => {
    if (!columnDef.enableCellHoverReveal) return
    const div = cellHoverRevealDivRef.current
    if (div) {
      const isOverflow = div.scrollWidth > div.clientWidth
      setIsCellContentOverflowing(isOverflow)
    }
  }

  const onMouseLeave = () => {
    if (!columnDef.enableCellHoverReveal) return
    setIsCellContentOverflowing(false)
  }

  const renderCellContent = () => {
    if (cell.getIsPlaceholder()) {
      return columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null
    }

    if (showSkeletons !== false && (isLoading || showSkeletons)) {
      return <Skeleton height={20} width={skeletonWidth} {...skeletonProps} />
    }

    if (
      columnDefType === 'display' &&
      (['mrt-row-expand', 'mrt-row-numbers', 'mrt-row-select'].includes(
        column.id,
      ) ||
        !row.getIsGrouped())
    ) {
      return columnDef.Cell?.({
        column,
        renderedCellValue: cell.renderValue() as any,
        row,
        rowRef,
        ...cellValueProps,
      })
    }

    if (isCreating || isEditing) {
      return <MRT_EditCellTextInput cell={cell} table={table} />
    }

    if (showClickToCopyButton && columnDef.enableClickToCopy !== false) {
      return (
        <MRT_CopyButton cell={cell} table={table}>
          <MRT_TableBodyCellValue {...cellValueProps} />
        </MRT_CopyButton>
      )
    }

    return <MRT_TableBodyCellValue {...cellValueProps} />
  }

  return (
    <TableTd
      data-column-pinned={isColumnPinned || undefined}
      data-dragging-column={isDraggingColumn || undefined}
      data-first-right-pinned={
        (isColumnPinned === 'right' &&
          column.getIsFirstColumn(isColumnPinned)) ||
        undefined
      }
      data-hovered-column-target={isHoveredColumn || undefined}
      data-index={renderedColumnIndex}
      data-last-left-pinned={
        (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) ||
        undefined
      }
      data-last-row={renderedRowIndex === numRows - 1 || undefined}
      data-resizing={
        (columnResizeMode === 'onChange' &&
          columnResizing?.isResizingColumn === column.id &&
          columnResizeDirection) ||
        undefined
      }
      {...tableCellProps}
      __vars={{
        '--mrt-cell-align':
          tableCellProps.align ?? (direction.dir === 'rtl' ? 'right' : 'left'),
        '--mrt-table-cell-left':
          isColumnPinned === 'left'
            ? `${column.getStart(isColumnPinned)}`
            : undefined,
        '--mrt-table-cell-right':
          isColumnPinned === 'right'
            ? `${column.getAfter(isColumnPinned)}`
            : undefined,
        ...tableCellProps.__vars,
      }}
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid') && classes['root-grid'],
        virtualCell && classes['root-virtualized'],
        isEditable &&
          editDisplayMode === 'cell' &&
          classes['root-cursor-pointer'],
        isEditable &&
          ['cell', 'table'].includes(editDisplayMode ?? '') &&
          columnDefType !== 'display' &&
          classes['root-editable-hover'],
        columnDefType === 'data' && classes['root-data-col'],
        density === 'xs' && classes['root-nowrap'],
        columnDef.enableCellHoverReveal && classes['root-cell-hover-reveal'],
        tableCellProps?.className,
      )}
      onDoubleClick={handleDoubleClick}
      onDragEnter={handleDragEnter}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={(theme) => ({
        ...widthStyles,
        ...parseFromValuesOrFunc(tableCellProps.style, theme),
      })}
    >
      <>
        {tableCellProps.children ??
          (columnDef.enableCellHoverReveal ? (
            <div
              className={clsx(
                columnDef.enableCellHoverReveal &&
                  !(isCreating || isEditing) &&
                  classes['cell-hover-reveal'],
                isCellContentOverflowing && classes['overflowing'],
              )}
              ref={cellHoverRevealDivRef}
            >
              {renderCellContent()}
              {cell.getIsGrouped() && !columnDef.GroupedCell && (
                <> ({row.subRows?.length})</>
              )}
            </div>
          ) : (
            <>
              {renderCellContent()}
              {cell.getIsGrouped() && !columnDef.GroupedCell && (
                <> ({row.subRows?.length})</>
              )}
            </>
          ))}
      </>
    </TableTd>
  )
}

export const Memo_MRT_TableBodyCell = memo(
  MRT_TableBodyCell,
  (prev, next) => next.cell === prev.cell,
) as typeof MRT_TableBodyCell
