import clsx from 'clsx'

import { useMemo, useState } from 'react'

import { Button, Flex, Menu } from '@mantine/core'

import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils'
import { MRT_ShowHideColumnsMenuItems } from './MRT_ShowHideColumnsMenuItems'
import classes from './MRT_ShowHideColumnsMenu.module.css'
import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types'

interface Props<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>
}

export const MRT_ShowHideColumnsMenu = <TData extends MRT_RowData>({
  table,
}: Props<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    state,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
  } = table
  const { columnOrder, columnPinning } = state

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value))
  }

  const allColumns = useMemo(() => {
    const columns = getAllColumns()
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean)
    }
    return columns
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as Array<MRT_Column<TData>>

  const [hoveredColumn, setHoveredColumn] = useState<MRT_Column<TData> | null>(
    null,
  )

  return (
    <Menu.Dropdown className={clsx('mrt-show-hide-columns-menu', classes.root)}>
      <Flex className={classes.content}>
        {enableHiding && (
          <Button
            disabled={!getIsSomeColumnsVisible()}
            onClick={() => handleToggleAllColumns(false)}
            variant="subtle"
          >
            {localization.hideAll}
          </Button>
        )}
        {enableColumnOrdering && (
          <Button
            onClick={() =>
              table.setColumnOrder(
                getDefaultColumnOrderIds(table.options as any, true),
              )
            }
            variant="subtle"
          >
            {localization.resetOrder}
          </Button>
        )}
        {enableColumnPinning && (
          <Button
            disabled={!getIsSomeColumnsPinned()}
            onClick={() => table.resetColumnPinning(true)}
            variant="subtle"
          >
            {localization.unpinAll}
          </Button>
        )}
        {enableHiding && (
          <Button
            disabled={getIsAllColumnsVisible()}
            onClick={() => handleToggleAllColumns(true)}
            variant="subtle"
          >
            {localization.showAll}
          </Button>
        )}
      </Flex>
      <Menu.Divider />
      {allColumns.map((column, index) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={column}
          hoveredColumn={hoveredColumn}
          key={`${index}-${column.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </Menu.Dropdown>
  )
}
