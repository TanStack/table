import clsx from 'clsx'

import { TableTh, TableThead, TableTr } from '@mantine/core'

import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ToolbarAlertBanner } from '../toolbar/MRT_ToolbarAlertBanner'
import { MRT_TableHeadRow } from './MRT_TableHeadRow'
import classes from './MRT_TableHead.module.css'
import type {
  MRT_ColumnVirtualizer,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { TableTheadProps } from '@mantine/core'

interface Props<TData extends MRT_RowData> extends TableTheadProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  table: MRT_TableInstance<TData>
}

export const MRT_TableHead = <TData extends MRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getHeaderGroups,
    getSelectedRowModel,
    state,
    options: {
      enableStickyHeader,
      layoutMode,
      mantineTableHeadProps,
      positionToolbarAlertBanner,
    },
    refs: { tableHeadRef },
  } = table
  const { isFullScreen, showAlertBanner } = state

  const tableHeadProps = {
    ...parseFromValuesOrFunc(mantineTableHeadProps, {
      table,
    }),
    ...rest,
  }

  const stickyHeader = enableStickyHeader || isFullScreen

  return (
    <TableThead
      {...tableHeadProps}
      className={clsx(
        classes.root,
        layoutMode?.startsWith('grid')
          ? classes['root-grid']
          : classes['root-table-row-group'],
        stickyHeader && classes['root-sticky'],
        tableHeadProps?.className,
      )}
      pos={
        stickyHeader && layoutMode?.startsWith('grid') ? 'sticky' : 'relative'
      }
      ref={(ref: HTMLTableSectionElement) => {
        tableHeadRef.current = ref
        if (tableHeadProps?.ref) {
          // @ts-ignore
          tableHeadProps.ref.current = ref
        }
      }}
    >
      {positionToolbarAlertBanner === 'head-overlay' &&
      (showAlertBanner || getSelectedRowModel().rows.length > 0) ? (
        <TableTr
          className={clsx(
            classes['banner-tr'],
            layoutMode?.startsWith('grid') && classes.grid,
          )}
        >
          <TableTh
            className={clsx(
              classes['banner-th'],
              layoutMode?.startsWith('grid') && classes.grid,
            )}
            colSpan={table.getVisibleLeafColumns().length}
          >
            <MRT_ToolbarAlertBanner table={table} />
          </TableTh>
        </TableTr>
      ) : (
        getHeaderGroups().map((headerGroup) => (
          <MRT_TableHeadRow
            columnVirtualizer={columnVirtualizer}
            headerGroup={headerGroup as any}
            key={headerGroup.id}
            table={table}
          />
        ))
      )}
    </TableThead>
  )
}
