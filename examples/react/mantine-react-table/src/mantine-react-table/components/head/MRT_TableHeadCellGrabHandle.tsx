import { reorderColumn } from '../../utils/column.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_GrabHandleButton } from '../buttons/MRT_GrabHandleButton'
import type {DragEvent, RefObject} from 'react';

import type {ActionIconProps} from '@mantine/core';

import type {MRT_CellValue, MRT_Column, MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<
  TData extends MRT_RowData,
  TValue = MRT_CellValue,
> extends ActionIconProps {
  column: MRT_Column<TData, TValue>
  table: MRT_TableInstance<TData>
  tableHeadCellRef: RefObject<HTMLTableCellElement>
}

export const MRT_TableHeadCellGrabHandle = <TData extends MRT_RowData>({
  column,
  table,
  tableHeadCellRef,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: { enableColumnOrdering, mantineColumnDragHandleProps },
    setColumnOrder,
    setDraggingColumn,
    setHoveredColumn,
  } = table
  const { columnDef } = column
  const { columnOrder, draggingColumn, hoveredColumn } = state

  const arg = { column, table }
  const actionIconProps = {
    ...parseFromValuesOrFunc(mantineColumnDragHandleProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineColumnDragHandleProps, arg),
    ...rest,
  }

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    actionIconProps?.onDragStart?.(event)
    setDraggingColumn(column)
    event.dataTransfer.setDragImage(
      tableHeadCellRef.current,
      0,
      0,
    )
  }

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    actionIconProps?.onDragEnd?.(event)
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping()
    } else if (
      enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn?.id !== draggingColumn?.id
    ) {
      setColumnOrder(
        reorderColumn(column, hoveredColumn as MRT_Column<TData>, columnOrder),
      )
    }
    setDraggingColumn(null)
    setHoveredColumn(null)
  }

  return (
    <MRT_GrabHandleButton
      actionIconProps={actionIconProps}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
    />
  )
}
