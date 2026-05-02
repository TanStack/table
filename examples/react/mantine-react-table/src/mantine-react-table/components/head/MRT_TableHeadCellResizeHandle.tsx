import clsx from 'clsx'


import { Box  } from '@mantine/core'
import classes from './MRT_TableHeadCellResizeHandle.module.css'
import type {BoxProps} from '@mantine/core';

import type {MRT_Header, MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<TData extends MRT_RowData> extends BoxProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: { columnResizeDirection, columnResizeMode },
    setColumnResizing,
  } = table
  const { density } = state
  const { column } = header
  const handler = header.getResizeHandler()

  const offset =
    column.getIsResizing() && columnResizeMode === 'onEnd'
      ? `translateX(${
          (columnResizeDirection === 'rtl' ? -1 : 1) *
          (state.columnResizing.deltaOffset ?? 0)
        }px)`
      : undefined

  return (
    <Box
      onDoubleClick={() => {
        setColumnResizing((old) => ({
          ...old,
          isResizingColumn: false,
        }))
        column.resetSize()
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      role="separator"
      {...rest}
      __vars={{ '--mrt-transform': offset, ...rest.__vars }}
      className={clsx(
        'mrt-table-head-cell-resize-handle',
        classes.root,
        classes[`root-${columnResizeDirection}`],
        !header.subHeaders.length &&
          columnResizeMode === 'onChange' &&
          classes['root-hide'],
        density,
        rest.className,
      )}
    />
  )
}
