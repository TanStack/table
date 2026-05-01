import { memo, useMemo } from 'react'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import { useMRT_RowVirtualizer } from '../../hooks/useMRT_RowVirtualizer'
import { useMRT_Rows } from '../../hooks/useMRT_Rows'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableBodyRow, Memo_MRT_TableBodyRow } from './MRT_TableBodyRow'
import type {
  MRT_ColumnVirtualizer,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { TableBodyProps } from '@mui/material/TableBody'
import type { VirtualItem } from '@tanstack/react-virtual'

export interface MRT_TableBodyProps<
  TData extends MRT_RowData,
> extends TableBodyProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  table: MRT_TableInstance<TData>
}

export const MRT_TableBody = <TData extends MRT_RowData>({
  columnVirtualizer,
  table,
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
      localization,
      memoMode,
      muiTableBodyProps,
      renderDetailPanel,
      renderEmptyRowsFallback,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef, tablePaperRef },
  } = table
  const { columnFilters, globalFilter, isFullScreen, rowPinning } = state

  const tableBodyProps = {
    ...parseFromValuesOrFunc(muiTableBodyProps, { table }),
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
  }

  return (
    <>
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('top') && (
          <TableBody
            {...tableBodyProps}
            sx={(theme) => ({
              display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
              position: 'sticky',
              top: tableHeadHeight - 1,
              zIndex: 1,
              ...(parseFromValuesOrFunc(tableBodyProps?.sx, theme) as any),
            })}
          >
            {getTopRows().map((row, staticRowIndex) => {
              const props = {
                ...commonRowProps,
                row,
                staticRowIndex,
              }
              return memoMode === 'rows' ? (
                <Memo_MRT_TableBodyRow key={row.id} {...props} />
              ) : (
                <MRT_TableBodyRow key={row.id} {...props} />
              )
            })}
          </TableBody>
        )}
      <TableBody
        {...tableBodyProps}
        sx={(theme) => ({
          display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
          height: rowVirtualizer
            ? `${rowVirtualizer.getTotalSize()}px`
            : undefined,
          minHeight: !rows.length ? '100px' : undefined,
          position: 'relative',
          ...(parseFromValuesOrFunc(tableBodyProps?.sx, theme) as any),
        })}
      >
        {tableBodyProps?.children ??
          (!rows.length ? (
            <tr
              style={{
                display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
              }}
            >
              <td
                colSpan={table.getVisibleLeafColumns().length}
                style={{
                  display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
                }}
              >
                {renderEmptyRowsFallback?.({ table }) ?? (
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      maxWidth: `min(100vw, ${
                        tablePaperRef.current?.clientWidth
                          ? tablePaperRef.current?.clientWidth + 'px'
                          : '100%'
                      })`,
                      py: '2rem',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {globalFilter || columnFilters.length
                      ? localization.noResultsFound
                      : localization.noRecordsToDisplay}
                  </Typography>
                )}
              </td>
            </tr>
          ) : (
            <>
              {(virtualRows ?? rows).map((rowOrVirtualRow, staticRowIndex) => {
                let row = rowOrVirtualRow as MRT_Row<TData>
                if (rowVirtualizer) {
                  if (renderDetailPanel) {
                    if (rowOrVirtualRow.index % 2 === 1) {
                      return null
                    } else {
                      staticRowIndex = rowOrVirtualRow.index / 2
                    }
                  } else {
                    staticRowIndex = rowOrVirtualRow.index
                  }
                  row = rows[staticRowIndex]
                }
                const props = {
                  ...commonRowProps,
                  pinnedRowIds,
                  row,
                  rowVirtualizer,
                  staticRowIndex,
                  virtualRow: rowVirtualizer
                    ? (rowOrVirtualRow as VirtualItem)
                    : undefined,
                }
                const key = `${row.id}-${row.index}`
                return memoMode === 'rows' ? (
                  <Memo_MRT_TableBodyRow key={key} {...props} />
                ) : (
                  <MRT_TableBodyRow key={key} {...props} />
                )
              })}
            </>
          ))}
      </TableBody>
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('bottom') && (
          <TableBody
            {...tableBodyProps}
            sx={(theme) => ({
              bottom: tableFooterHeight - 1,
              display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
              position: 'sticky',
              zIndex: 1,
              ...(parseFromValuesOrFunc(tableBodyProps?.sx, theme) as any),
            })}
          >
            {getBottomRows().map((row, staticRowIndex) => {
              const props = {
                ...commonRowProps,
                row,
                staticRowIndex,
              }
              return memoMode === 'rows' ? (
                <Memo_MRT_TableBodyRow key={row.id} {...props} />
              ) : (
                <MRT_TableBodyRow key={row.id} {...props} />
              )
            })}
          </TableBody>
        )}
    </>
  )
}

export const Memo_MRT_TableBody = memo(
  MRT_TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof MRT_TableBody
