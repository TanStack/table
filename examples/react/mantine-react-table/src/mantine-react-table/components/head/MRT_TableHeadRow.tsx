import clsx from 'clsx'


import { Box, TableTr  } from '@mantine/core'


import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableHeadCell } from './MRT_TableHeadCell'
import classes from './MRT_TableHeadRow.module.css'
import type {MRT_ColumnVirtualizer, MRT_Header, MRT_HeaderGroup, MRT_RowData, MRT_TableInstance, MRT_VirtualItem} from '../../types';
import type {TableTrProps} from '@mantine/core';

interface Props<TData extends MRT_RowData> extends TableTrProps {
  columnVirtualizer?: MRT_ColumnVirtualizer
  headerGroup: MRT_HeaderGroup<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadRow = <TData extends MRT_RowData>({
  columnVirtualizer,
  headerGroup,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: { enableStickyHeader, layoutMode, mantineTableHeadRowProps },
  } = table
  const { isFullScreen } = state

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {}

  const tableRowProps = {
    ...parseFromValuesOrFunc(mantineTableHeadRowProps, {
      headerGroup,
      table,
    }),
    ...rest,
  }

  return (
    <TableTr
      {...tableRowProps}
      className={clsx(
        classes.root,
        (enableStickyHeader || isFullScreen) && classes.sticky,
        layoutMode?.startsWith('grid') && classes['layout-mode-grid'],
        tableRowProps?.className,
      )}
    >
      {virtualPaddingLeft ? (
        <Box component="th" display="flex" w={virtualPaddingLeft} />
      ) : null}
      {(virtualColumns ?? headerGroup.headers).map(
        (headerOrVirtualHeader, renderedHeaderIndex) => {
          let header = headerOrVirtualHeader as MRT_Header<TData>
          if (columnVirtualizer) {
            renderedHeaderIndex = (headerOrVirtualHeader as MRT_VirtualItem)
              .index
            header = headerGroup.headers[renderedHeaderIndex]
          }

          return (
            <MRT_TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
              renderedHeaderIndex={renderedHeaderIndex}
              table={table}
            />
          )
        },
      )}
      {virtualPaddingRight ? (
        <Box component="th" display="flex" w={virtualPaddingRight} />
      ) : null}
    </TableTr>
  )
}
