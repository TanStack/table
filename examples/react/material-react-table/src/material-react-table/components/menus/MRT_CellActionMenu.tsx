import Menu from '@mui/material/Menu'
import { openEditingCell } from '../../utils/cell.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMRTContext } from '../../hooks/mrtTableHook'
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem'
import type { MenuProps } from '@mui/material/Menu'
import type { MRT_Cell, MRT_RowData } from '../../types'

export interface MRT_CellActionMenuProps extends Partial<MenuProps> {}

export const MRT_CellActionMenu = ({ ...rest }: MRT_CellActionMenuProps) => {
  const table = useMRTContext()
  const {
    state,
    options: {
      editDisplayMode,
      enableClickToCopy,
      enableEditing,
      icons: { ContentCopy, EditIcon },
      localization,
      mrtTheme: { menuBackgroundColor },
      renderCellActionMenuItems,
    },
    refs: { actionCellRef },
  } = table
  const { actionCell, density } = state
  // `actionCell` is stored as `Cell<any, any, any>` on the (non-generic) state
  // map; narrow it back to the MRT cell shape for the render props below.
  const cell = actionCell! as MRT_Cell<MRT_RowData>
  const { row } = cell
  const { column } = cell
  const { columnDef } = column

  const handleClose = (event?: any) => {
    event?.stopPropagation()
    table.setActionCell(null)
    actionCellRef.current = null
  }

  const internalMenuItems = [
    (parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) ===
        'context-menu') && (
      <MRT_ActionMenuItem
        icon={<ContentCopy />}
        key={'mrt-copy'}
        label={localization.copy}
        onClick={(event) => {
          event.stopPropagation()
          navigator.clipboard.writeText(cell.getValue() as string)
          handleClose()
        }}
      />
    ),
    parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell' && (
      <MRT_ActionMenuItem
        icon={<EditIcon />}
        key={'mrt-edit'}
        label={localization.edit}
        onClick={() => {
          openEditingCell({ cell, table })
          handleClose()
        }}
      />
    ),
  ].filter(Boolean)

  const renderActionProps = {
    cell,
    closeMenu: handleClose,
    column,
    internalMenuItems,
    row,
    table,
  }

  const menuItems =
    columnDef.renderCellActionMenuItems?.(renderActionProps) ??
    renderCellActionMenuItems?.(renderActionProps)

  return (
    (!!menuItems?.length || !!internalMenuItems?.length) && (
      <Menu
        slotProps={{
          list: {
            dense: density === 'compact',
            sx: {
              backgroundColor: menuBackgroundColor,
            },
          },
        }}
        anchorEl={actionCellRef.current}
        disableScrollLock
        onClick={(event) => event.stopPropagation()}
        onClose={handleClose}
        open={!!cell}
        transformOrigin={{ horizontal: -100, vertical: 8 }}
        {...rest}
      >
        {menuItems ?? internalMenuItems}
      </Menu>
    )
  )
}
