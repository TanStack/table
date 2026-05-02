import clsx from 'clsx'

import { memo, useMemo } from 'react'

import { TableTbody } from '@mantine/core'

import { useMRT_Rows } from '../../hooks/useMRT_Rows'
import { useMRT_RowVirtualizer } from '../../hooks/useMRT_RowVirtualizer'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableBodyRow, Memo_MRT_TableBodyRow } from './MRT_TableBodyRow'
import { MRT_TableBodyEmptyRow } from './MRT_TableBodyEmptyRow'
import classes from './MRT_TableBody.module.css'
import type {
  MRT_ColumnVirtualizer,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
  MRT_VirtualItem,
} from '../../types'
import type { TableProps, TableTbodyProps } from '@mantine/core'

export interface MRT_TableBodyProps<
  TData extends MRT_RowData,
> extends TableTbodyProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  table: MRT_TableInstance<TData>
  tableProps: Partial<TableProps>
}

export const MRT_TableBody = <TData extends MRT_RowData>({
  columnVirtualizer,
  table,
  tableProps,
  ...rest
}: MRT_TableBodyProps<TData>) => {
  const {
    getBottomRows,
    getIsSomeRowsPinned,
    getRowModel,
    state,
    getTopRows,
    options: {
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      mantineTableBodyProps,
      memoMode,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
  } = table
  const { isFullScreen, rowPinning } = state

  const tableBodyProps = {
    ...parseFromValuesOrFunc(mantineTableBodyProps, { table }),
    ...rest,
  }

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0

  const pinnedRowIds = useMemo(() => {
    if (!rowPinning.bottom?.length && !rowPinning.top?.length) return []
    return getRowModel()
      .rows.filter((row) => row.getIsPinned())
      .map((r) => r.id)
  }, [rowPinning, getRowModel().rows])

  const rows = useMRT_Rows(table)

  const rowVirtualizer = useMRT_RowVirtualizer(table, rows)

  const { virtualRows } = rowVirtualizer ?? {}

  const commonRowProps = {
    columnVirtualizer,
    numRows: rows.length,
    table,
    tableProps,
  }

  return (
    <>
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('top') && (
          <TableTbody
            {...tableBodyProps}
            __vars={{
              '--mrt-table-head-height': `${tableHeadHeight}`,
              ...tableBodyProps?.__vars,
            }}
            className={clsx(
              classes.pinned,
              layoutMode?.startsWith('grid') && classes['root-grid'],
              tableBodyProps?.className,
            )}
          >
            {getTopRows().map((row, renderedRowIndex) => {
              const rowProps = {
                ...commonRowProps,
                renderedRowIndex,
                row,
              }
              return memoMode === 'rows' ? (
                <Memo_MRT_TableBodyRow key={row.id} {...rowProps} />
              ) : (
                <MRT_TableBodyRow key={row.id} {...rowProps} />
              )
            })}
          </TableTbody>
        )}
      <TableTbody
        {...tableBodyProps}
        __vars={{
          '--mrt-table-body-height': rowVirtualizer
            ? `${rowVirtualizer.getTotalSize()}px`
            : undefined,
          ...tableBodyProps?.__vars,
        }}
        className={clsx(
          classes.root,
          layoutMode?.startsWith('grid') && classes['root-grid'],
          !rows.length && classes['root-no-rows'],
          rowVirtualizer && classes['root-virtualized'],
          tableBodyProps?.className,
        )}
      >
        {tableBodyProps?.children ??
          (!rows.length ? (
            <MRT_TableBodyEmptyRow {...commonRowProps} />
          ) : (
            <>
              {(virtualRows ?? rows).map(
                (rowOrVirtualRow, renderedRowIndex) => {
                  if (rowVirtualizer) {
                    if (renderDetailPanel) {
                      if (rowOrVirtualRow.index % 2 === 1) {
                        return null
                      } else {
                        renderedRowIndex = rowOrVirtualRow.index / 2
                      }
                    } else {
                      renderedRowIndex = rowOrVirtualRow.index
                    }
                  }
                  const row = rowVirtualizer
                    ? rows[renderedRowIndex]
                    : (rowOrVirtualRow as MRT_Row<TData>)
                  const props = {
                    ...commonRowProps,
                    pinnedRowIds,
                    renderedRowIndex,
                    row,
                    rowVirtualizer,
                    virtualRow: rowVirtualizer
                      ? (rowOrVirtualRow as MRT_VirtualItem)
                      : undefined,
                  }
                  const key = `${row.id}-${row.index}`
                  return memoMode === 'rows' ? (
                    <Memo_MRT_TableBodyRow key={key} {...props} />
                  ) : (
                    <MRT_TableBodyRow key={key} {...props} />
                  )
                },
              )}
            </>
          ))}
      </TableTbody>
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('bottom') && (
          <TableTbody
            {...tableBodyProps}
            __vars={{
              '--mrt-table-footer-height': `${tableFooterHeight}`,
              ...tableBodyProps?.__vars,
            }}
            className={clsx(
              classes.pinned,
              layoutMode?.startsWith('grid') && classes['root-grid'],
              tableBodyProps?.className,
            )}
          >
            {getBottomRows().map((row, renderedRowIndex) => {
              const props = {
                ...commonRowProps,
                renderedRowIndex,
                row,
              }
              return memoMode === 'rows' ? (
                <Memo_MRT_TableBodyRow key={row.id} {...props} />
              ) : (
                <MRT_TableBodyRow key={row.id} {...props} />
              )
            })}
          </TableTbody>
        )}
    </>
  )
}

export const Memo_MRT_TableBody = memo(
  MRT_TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof MRT_TableBody
