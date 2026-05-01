import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils'
import { MRT_ShowHideColumnsMenuItems } from './MRT_ShowHideColumnsMenuItems'
import type {
  MRT_Column,
  MRT_ColumnVisibilityState,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { MenuProps } from '@mui/material/Menu'

export interface MRT_ShowHideColumnsMenuProps<
  TData extends MRT_RowData,
> extends Partial<MenuProps> {
  anchorEl: HTMLElement | null
  isSubMenu?: boolean
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  table: MRT_TableInstance<TData>
}

export const MRT_ShowHideColumnsMenu = <TData extends MRT_RowData>({
  anchorEl,
  setAnchorEl,
  table,
  ...rest
}: MRT_ShowHideColumnsMenuProps<TData>) => {
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
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
      mrtTheme: { menuBackgroundColor },
    },
  } = table
  const { columnOrder, columnPinning, density } = state

  const handleToggleAllColumns = (value?: boolean) => {
    const updates = getAllLeafColumns()
      .filter((column) => column.columnDef.enableHiding !== false)
      .reduce((acc, column) => {
        acc[column.id] = value ?? !column.getIsVisible()
        return acc
      }, {} as MRT_ColumnVisibilityState)

    table.setColumnVisibility((old) => ({ ...old, ...updates }))
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

  const isNestedColumns = allColumns.some(
    (col) => col.columnDef.columnDefType === 'group',
  )

  const hasColumnOrderChanged = useMemo(
    () =>
      columnOrder.length !== initialState.columnOrder.length ||
      !columnOrder.every(
        (column, index) => column === initialState.columnOrder[index],
      ),

    [columnOrder, initialState.columnOrder],
  )

  const [hoveredColumn, setHoveredColumn] = useState<MRT_Column<TData> | null>(
    null,
  )

  return (
    <Menu
      slotProps={{
        list: {
          dense: density === 'compact',
          sx: {
            backgroundColor: menuBackgroundColor,
          },
        },
      }}
      anchorEl={anchorEl}
      disableScrollLock
      onClose={() => setAnchorEl(null)}
      open={!!anchorEl}
      {...rest}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: '0.5rem',
          pt: 0,
        }}
      >
        {enableHiding && (
          <Button
            disabled={!getIsSomeColumnsVisible()}
            onClick={() => handleToggleAllColumns(false)}
          >
            {localization.hideAll}
          </Button>
        )}
        {enableColumnOrdering && (
          <Button
            onClick={() =>
              table.setColumnOrder(
                getDefaultColumnOrderIds(table.options, true),
              )
            }
            disabled={!hasColumnOrderChanged}
          >
            {localization.resetOrder}
          </Button>
        )}
        {enableColumnPinning && (
          <Button
            disabled={!getIsSomeColumnsPinned()}
            onClick={() => table.resetColumnPinning(true)}
          >
            {localization.unpinAll}
          </Button>
        )}
        {enableHiding && (
          <Button
            disabled={getIsAllColumnsVisible()}
            onClick={() => handleToggleAllColumns(true)}
          >
            {localization.showAll}
          </Button>
        )}
      </Box>
      <Divider />
      {allColumns.map((column, index) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={column}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${index}-${column.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </Menu>
  )
}
