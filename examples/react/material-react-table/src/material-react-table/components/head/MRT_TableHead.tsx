import TableHead from '@mui/material/TableHead'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ToolbarAlertBanner } from '../toolbar/MRT_ToolbarAlertBanner'
import { MRT_TableHeadRow } from './MRT_TableHeadRow'
import type {
  MRT_ColumnVirtualizer,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { TableHeadProps } from '@mui/material/TableHead'

export interface MRT_TableHeadProps<
  TData extends MRT_RowData,
> extends TableHeadProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  table: MRT_TableInstance<TData>
}

export const MRT_TableHead = <TData extends MRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: MRT_TableHeadProps<TData>) => {
  const {
    state,
    options: {
      enableStickyHeader,
      layoutMode,
      muiTableHeadProps,
      positionToolbarAlertBanner,
    },
    refs: { tableHeadRef },
  } = table
  const { isFullScreen, showAlertBanner } = state

  const tableHeadProps = {
    ...parseFromValuesOrFunc(muiTableHeadProps, { table }),
    ...rest,
  }

  const stickyHeader = enableStickyHeader || isFullScreen

  return (
    <TableHead
      {...tableHeadProps}
      ref={(ref: HTMLTableSectionElement) => {
        tableHeadRef.current = ref
        if (tableHeadProps?.ref) {
          // @ts-expect-error
          tableHeadProps.ref.current = ref
        }
      }}
      sx={(theme) => ({
        display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
        opacity: 0.97,
        position: stickyHeader ? 'sticky' : 'relative',
        top: stickyHeader && layoutMode?.startsWith('grid') ? 0 : undefined,
        zIndex: stickyHeader ? 2 : undefined,
        ...(parseFromValuesOrFunc(tableHeadProps?.sx, theme) as any),
      })}
    >
      {positionToolbarAlertBanner === 'head-overlay' &&
      (showAlertBanner || table.getSelectedRowModel().rows.length > 0) ? (
        <tr
          style={{
            display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
          }}
        >
          <th
            colSpan={table.getVisibleLeafColumns().length}
            style={{
              display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
              padding: 0,
            }}
          >
            <MRT_ToolbarAlertBanner table={table} />
          </th>
        </tr>
      ) : (
        table
          .getHeaderGroups()
          .map((headerGroup) => (
            <MRT_TableHeadRow
              columnVirtualizer={columnVirtualizer}
              headerGroup={headerGroup as any}
              key={headerGroup.id}
              table={table}
            />
          ))
      )}
    </TableHead>
  )
}
