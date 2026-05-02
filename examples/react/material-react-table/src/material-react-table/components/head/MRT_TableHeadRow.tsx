import TableRow from '@mui/material/TableRow'
import { alpha } from '@mui/material/styles'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableHeadCell } from './MRT_TableHeadCell'
import type {
  MRT_ColumnVirtualizer,
  MRT_Header,
  MRT_HeaderGroup,
  MRT_RowData,
  MRT_TableInstance,
  MRT_VirtualItem,
} from '../../types'
import type { TableRowProps } from '@mui/material/TableRow'

export interface MRT_TableHeadRowProps<
  TData extends MRT_RowData,
> extends TableRowProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  headerGroup: MRT_HeaderGroup<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadRow = <TData extends MRT_RowData>({
  columnVirtualizer,
  headerGroup,
  table,
  ...rest
}: MRT_TableHeadRowProps<TData>) => {
  const {
    options: {
      enableStickyHeader,
      layoutMode,
      mrtTheme: { baseBackgroundColor },
      muiTableHeadRowProps,
    },
  } = table

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {}

  const tableRowProps = {
    ...parseFromValuesOrFunc(muiTableHeadRowProps, {
      headerGroup,
      table,
    }),
    ...rest,
  }

  return (
    <TableRow
      {...tableRowProps}
      sx={(theme) => ({
        backgroundColor: baseBackgroundColor,
        boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.1)}`,
        display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
        position:
          enableStickyHeader && layoutMode === 'semantic'
            ? 'sticky'
            : 'relative',
        top: 0,
        ...(parseFromValuesOrFunc(tableRowProps?.sx, theme) as any),
      })}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? headerGroup.headers).map(
        (headerOrVirtualHeader, staticColumnIndex) => {
          let header = headerOrVirtualHeader as MRT_Header<TData>
          if (columnVirtualizer) {
            staticColumnIndex = (headerOrVirtualHeader as MRT_VirtualItem).index
            header = headerGroup.headers[staticColumnIndex]
          }

          return header ? (
            <MRT_TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
              staticColumnIndex={staticColumnIndex}
              table={table}
            />
          ) : null
        },
      )}
      {virtualPaddingRight ? (
        <th style={{ display: 'flex', width: virtualPaddingRight }} />
      ) : null}
    </TableRow>
  )
}
