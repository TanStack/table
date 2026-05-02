import { useMemo } from 'react'
import Menu from '@mui/material/Menu'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'
import type { MenuProps } from '@mui/material/Menu'
import type { MouseEvent, ReactNode } from 'react'

export interface MRT_RowActionMenuProps<
  TData extends MRT_RowData,
> extends Partial<MenuProps> {
  anchorEl: HTMLElement | null
  handleEdit: (event: MouseEvent) => void
  row: MRT_Row<TData>
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  staticRowIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_RowActionMenu = <TData extends MRT_RowData>({
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  staticRowIndex,
  table,
  ...rest
}: MRT_RowActionMenuProps<TData>) => {
  const {
    state,
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      mrtTheme: { menuBackgroundColor },
      renderRowActionMenuItems,
    },
  } = table
  const { density } = state

  const menuItems = useMemo(() => {
    const items: Array<ReactNode> = []
    const editItem = parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode!) && (
        <MRT_ActionMenuItem
          key={'edit'}
          icon={<EditIcon />}
          label={localization.edit}
          onClick={handleEdit}
          table={table}
        />
      )
    if (editItem) items.push(editItem)
    const rowActionMenuItems = renderRowActionMenuItems?.({
      closeMenu: () => setAnchorEl(null),
      row,
      staticRowIndex,
      table,
    })
    if (rowActionMenuItems?.length) items.push(...rowActionMenuItems)
    return items
  }, [renderRowActionMenuItems, row, staticRowIndex, table])

  if (!menuItems.length) return null

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
      onClick={(event) => event.stopPropagation()}
      onClose={() => setAnchorEl(null)}
      open={!!anchorEl}
      {...rest}
    >
      {menuItems}
    </Menu>
  )
}
