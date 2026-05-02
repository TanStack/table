import TableFooter from '@mui/material/TableFooter'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableFooterRow } from './MRT_TableFooterRow'
import type {
  MRT_ColumnVirtualizer,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { TableFooterProps } from '@mui/material/TableFooter'

export interface MRT_TableFooterProps<
  TData extends MRT_RowData,
> extends TableFooterProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  table: MRT_TableInstance<TData>
}

export const MRT_TableFooter = <TData extends MRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: MRT_TableFooterProps<TData>) => {
  const {
    state,
    options: { enableStickyFooter, layoutMode, muiTableFooterProps },
    refs: { tableFooterRef },
  } = table
  const { isFullScreen } = state

  const tableFooterProps = {
    ...parseFromValuesOrFunc(muiTableFooterProps, {
      table,
    }),
    ...rest,
  }

  const stickFooter =
    (isFullScreen || enableStickyFooter) && enableStickyFooter !== false

  const footerGroups = table.getFooterGroups()

  // if no footer cells at all, skip footer
  if (
    !footerGroups.some((footerGroup) =>
      footerGroup.headers?.some(
        (header) =>
          (typeof header.column.columnDef.footer === 'string' &&
            !!header.column.columnDef.footer) ||
          header.column.columnDef.Footer,
      ),
    )
  ) {
    return null
  }

  return (
    <TableFooter
      {...tableFooterProps}
      ref={(ref: HTMLTableSectionElement) => {
        tableFooterRef.current = ref
        if (tableFooterProps?.ref) {
          // @ts-expect-error
          tableFooterProps.ref.current = ref
        }
      }}
      sx={(theme) => ({
        bottom: stickFooter ? 0 : undefined,
        display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
        opacity: stickFooter ? 0.97 : undefined,
        outline: stickFooter
          ? theme.palette.mode === 'light'
            ? `1px solid ${theme.palette.grey[300]}`
            : `1px solid ${theme.palette.grey[700]}`
          : undefined,
        position: stickFooter ? 'sticky' : 'relative',
        zIndex: stickFooter ? 1 : undefined,
        ...(parseFromValuesOrFunc(tableFooterProps?.sx, theme) as any),
      })}
    >
      {footerGroups.map((footerGroup) => (
        <MRT_TableFooterRow
          columnVirtualizer={columnVirtualizer}
          footerGroup={footerGroup as any}
          key={footerGroup.id}
          table={table}
        />
      ))}
    </TableFooter>
  )
}
