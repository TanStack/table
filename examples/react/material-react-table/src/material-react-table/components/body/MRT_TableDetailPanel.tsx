import Collapse from '@mui/material/Collapse'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { TableCellProps } from '@mui/material/TableCell'
import type {
  MRT_Row,
  MRT_RowData,
  MRT_RowVirtualizer,
  MRT_TableInstance,
  MRT_VirtualItem,
} from '../../types'
import type { RefObject } from 'react'

export interface MRT_TableDetailPanelProps<
  TData extends MRT_RowData,
> extends TableCellProps {
  parentRowRef: RefObject<HTMLTableRowElement | null>
  row: MRT_Row<TData>
  rowVirtualizer?: MRT_RowVirtualizer
  staticRowIndex: number
  table: MRT_TableInstance<TData>
  virtualRow?: MRT_VirtualItem
}

export const MRT_TableDetailPanel = <TData extends MRT_RowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  ...rest
}: MRT_TableDetailPanelProps<TData>) => {
  const {
    state,
    getVisibleLeafColumns,
    options: {
      layoutMode,
      mrtTheme: { baseBackgroundColor },
      muiDetailPanelProps,
      muiTableBodyRowProps,
      renderDetailPanel,
    },
  } = table
  const { isLoading } = state

  const tableRowProps = parseFromValuesOrFunc(muiTableBodyRowProps, {
    isDetailPanel: true,
    row,
    staticRowIndex,
    table,
  })

  const tableCellProps = {
    ...parseFromValuesOrFunc(muiDetailPanelProps, {
      row,
      table,
    }),
    ...rest,
  }

  const DetailPanel = !isLoading && renderDetailPanel?.({ row, table })

  return (
    <TableRow
      className="Mui-TableBodyCell-DetailPanel"
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node: HTMLTableRowElement) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node)
        }
      }}
      {...tableRowProps}
      sx={(theme) => ({
        display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
        position: virtualRow ? 'absolute' : undefined,
        top: virtualRow
          ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
          : undefined,
        transform: virtualRow
          ? `translateY(${virtualRow?.start}px)`
          : undefined,
        width: '100%',
        ...(parseFromValuesOrFunc(tableRowProps?.sx, theme) as any),
      })}
    >
      <TableCell
        className="Mui-TableBodyCell-DetailPanel"
        colSpan={getVisibleLeafColumns().length}
        {...tableCellProps}
        sx={(theme) => ({
          backgroundColor: virtualRow ? baseBackgroundColor : undefined,
          borderBottom: !row.getIsExpanded() ? 'none' : undefined,
          display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
          py: !!DetailPanel && row.getIsExpanded() ? '1rem' : 0,
          transition: !virtualRow ? 'all 150ms ease-in-out' : undefined,
          width: `100%`,
          ...(parseFromValuesOrFunc(tableCellProps?.sx, theme) as any),
        })}
      >
        {virtualRow ? (
          row.getIsExpanded() && DetailPanel
        ) : (
          <Collapse in={row.getIsExpanded()} mountOnEnter unmountOnExit>
            {DetailPanel}
          </Collapse>
        )}
      </TableCell>
    </TableRow>
  )
}
