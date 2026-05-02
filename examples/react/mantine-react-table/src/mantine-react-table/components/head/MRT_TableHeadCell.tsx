import clsx from 'clsx'


import {
  
  
  
  useMemo,
  useState
} from 'react'

import { Flex, TableTh,  useDirection } from '@mantine/core'
import { useHover } from '@mantine/hooks'

import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu'
import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer'
import { MRT_TableHeadCellFilterLabel } from './MRT_TableHeadCellFilterLabel'
import { MRT_TableHeadCellGrabHandle } from './MRT_TableHeadCellGrabHandle'
import { MRT_TableHeadCellResizeHandle } from './MRT_TableHeadCellResizeHandle'
import { MRT_TableHeadCellSortLabel } from './MRT_TableHeadCellSortLabel'

import classes from './MRT_TableHeadCell.module.css'
import type {MRT_ColumnVirtualizer, MRT_Header, MRT_RowData, MRT_TableInstance} from '../../types';
import type {TableThProps} from '@mantine/core';
import type {CSSProperties, DragEventHandler, ReactNode} from 'react';

interface Props<TData extends MRT_RowData> extends TableThProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  header: MRT_Header<TData>
  renderedHeaderIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCell = <TData extends MRT_RowData>({
  columnVirtualizer,
  header,
  renderedHeaderIndex = 0,
  table,
  ...rest
}: Props<TData>) => {
  const direction = useDirection()
  const {
    state,
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableHeaderActionsHoverReveal,
      enableMultiSort,
      layoutMode,
      mantineTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table
  const { columnResizing, draggingColumn, grouping, hoveredColumn } = state
  const { column } = header
  const { columnDef } = column
  const { columnDefType } = columnDef

  const arg = { column, table }
  const tableCellProps = {
    ...parseFromValuesOrFunc(mantineTableHeadCellProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineTableHeadCellProps, arg),
    ...rest,
  }

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--header-${parseCSSVarId(
      header?.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--header-${parseCSSVarId(header.id)}-size) * 1px)`,
  }
  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--header-${parseCSSVarId(header.id)}-size)`
    } 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
  }

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned()

  const isDraggingColumn = draggingColumn?.id === column.id
  const isHoveredColumn = hoveredColumn?.id === column.id

  const { hovered: isHoveredHeadCell, ref: isHoveredHeadCellRef } =
    useHover<HTMLTableCellElement>()

  const [isOpenedColumnActions, setIsOpenedColumnActions] = useState(false)

  const columnActionsEnabled =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false

  const showColumnButtons =
    !enableHeaderActionsHoverReveal ||
    isOpenedColumnActions ||
    (isHoveredHeadCell &&
      !table.getVisibleFlatColumns().find((column) => column.getIsResizing()))

  const showDragHandle =
    enableColumnDragging !== false &&
    columnDef.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
      (enableGrouping &&
        columnDef.enableGrouping !== false &&
        !grouping.includes(column.id))) &&
    showColumnButtons

  const headerPL = useMemo(() => {
    let pl = 0
    if (column.getCanSort()) pl++
    // Only add padding for buttons if they will actually be displayed
    if (showColumnButtons && (columnActionsEnabled || showDragHandle))
      pl += 1.75
    if (showDragHandle) pl += 1.25
    return pl
  }, [showColumnButtons, showDragHandle, columnActionsEnabled])

  const handleDragEnter: DragEventHandler<HTMLTableCellElement> = (_e) => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null)
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
    }
  }

  const headerElement =
    columnDef?.Header instanceof Function
      ? columnDef?.Header?.({
          column,
          header,
          table,
        })
      : (columnDef?.Header ?? (columnDef.header as ReactNode))

  return (
    <TableTh
      colSpan={header.colSpan}
      data-column-pinned={isColumnPinned || undefined}
      data-dragging-column={isDraggingColumn || undefined}
      data-first-right-pinned={
        (isColumnPinned === 'right' &&
          column.getIsFirstColumn(isColumnPinned)) ||
        undefined
      }
      data-hovered-column-target={isHoveredColumn || undefined}
      data-index={renderedHeaderIndex}
      data-last-left-pinned={
        (isColumnPinned === 'left' && column.getIsLastColumn(isColumnPinned)) ||
        undefined
      }
      data-resizing={
        (columnResizeMode === 'onChange' &&
          columnResizing?.isResizingColumn === column.id &&
          columnResizeDirection) ||
        undefined
      }
      {...tableCellProps}
      __vars={{
        '--mrt-table-cell-left':
          isColumnPinned === 'left'
            ? `${column.getStart(isColumnPinned)}`
            : undefined,
        '--mrt-table-cell-right':
          isColumnPinned === 'right'
            ? `${column.getAfter(isColumnPinned)}`
            : undefined,
      }}
      align={
        columnDefType === 'group'
          ? 'center'
          : direction.dir === 'rtl'
            ? 'right'
            : 'left'
      }
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid') && classes['root-grid'],
        enableMultiSort && column.getCanSort() && classes['root-no-select'],
        columnVirtualizer && classes['root-virtualized'],
        tableCellProps?.className,
      )}
      onDragEnter={handleDragEnter}
      ref={(node: HTMLTableCellElement) => {
        if (node) {
          tableHeadCellRefs.current[column.id] = node
          ;(isHoveredHeadCellRef as any).current = node
          if (columnDefType !== 'group') {
            columnVirtualizer?.measureElement?.(node)
          }
        }
      }}
      style={(theme) => ({
        ...widthStyles,
        ...parseFromValuesOrFunc(tableCellProps?.style, theme),
      })}
    >
      {header.isPlaceholder
        ? null
        : (tableCellProps.children ?? (
            <Flex
              className={clsx(
                'mrt-table-head-cell-content',
                classes.content,
                (columnDefType === 'group' ||
                  tableCellProps?.align === 'center') &&
                  classes['content-center'],
                tableCellProps?.align === 'right' && classes['content-right'],
                column.getCanResize() && classes['content-spaced'],
              )}
            >
              <Flex
                __vars={{
                  '--mrt-table-head-cell-labels-padding-left': `${headerPL}`,
                }}
                className={clsx(
                  'mrt-table-head-cell-labels',
                  classes.labels,
                  column.getCanSort() &&
                    columnDefType !== 'group' &&
                    classes['labels-sortable'],
                  tableCellProps?.align === 'right'
                    ? classes['labels-right']
                    : tableCellProps?.align === 'center' &&
                        classes['labels-center'],
                  columnDefType === 'data' && classes['labels-data'],
                )}
                onClick={column.getToggleSortingHandler()}
              >
                <Flex
                  className={clsx(
                    'mrt-table-head-cell-content-wrapper',
                    classes['content-wrapper'],
                    columnDefType === 'data' &&
                      classes['content-wrapper-hidden-overflow'],
                    (columnDef.header?.length ?? 0) < 20 &&
                      classes['content-wrapper-nowrap'],
                  )}
                >
                  {headerElement}
                </Flex>
                {column.getCanFilter() &&
                  (column.getIsFiltered() || showColumnButtons) && (
                    <MRT_TableHeadCellFilterLabel
                      header={header}
                      table={table}
                    />
                  )}
                {column.getCanSort() &&
                  (column.getIsSorted() || showColumnButtons) && (
                    <MRT_TableHeadCellSortLabel header={header} table={table} />
                  )}
              </Flex>
              {columnDefType !== 'group' && (
                <Flex
                  className={clsx(
                    'mrt-table-head-cell-content-actions',
                    classes['content-actions'],
                  )}
                >
                  {showDragHandle && (
                    <MRT_TableHeadCellGrabHandle
                      column={column}
                      table={table}
                      tableHeadCellRef={{
                        current: tableHeadCellRefs.current[column.id],
                      }}
                    />
                  )}
                  {columnActionsEnabled && showColumnButtons && (
                    <MRT_ColumnActionMenu
                      header={header}
                      onChange={setIsOpenedColumnActions}
                      opened={isOpenedColumnActions}
                      table={table}
                    />
                  )}
                </Flex>
              )}
              {column.getCanResize() && (
                <MRT_TableHeadCellResizeHandle header={header} table={table} />
              )}
            </Flex>
          ))}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <MRT_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </TableTh>
  )
}
