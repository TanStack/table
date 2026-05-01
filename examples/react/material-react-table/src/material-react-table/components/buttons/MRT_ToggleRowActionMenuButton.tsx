import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_RowActionMenu } from '../menus/MRT_RowActionMenu'
import { MRT_EditActionButtons } from './MRT_EditActionButtons'
import type {
  MRT_Cell,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MouseEvent } from 'react'

const commonIconButtonStyles = {
  '&:hover': {
    opacity: 1,
  },
  height: '2rem',
  ml: '10px',
  opacity: 0.5,
  transition: 'opacity 150ms',
  width: '2rem',
}

export interface MRT_ToggleRowActionMenuButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  cell: MRT_Cell<TData>
  row: MRT_Row<TData>
  staticRowIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleRowActionMenuButton = <TData extends MRT_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  ...rest
}: MRT_ToggleRowActionMenuButtonProps<TData>) => {
  const {
    state,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      icons: { EditIcon, MoreHorizIcon },
      localization,
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table

  const { creatingRow, editingRow } = state

  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row')

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation()
    setEditingRow({ ...row })
    setAnchorEl(null)
  }

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, staticRowIndex, table })
      ) : showEditActionButtons ? (
        <MRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) &&
        ['modal', 'row'].includes(editDisplayMode!) ? (
        <Tooltip placement="right" title={localization.edit}>
          <IconButton
            aria-label={localization.edit}
            onClick={handleStartEditMode}
            sx={commonIconButtonStyles}
            {...rest}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : renderRowActionMenuItems?.({
          row,
          staticRowIndex,
          table,
        } as any)?.length ? (
        <>
          <Tooltip {...getCommonTooltipProps()} title={localization.rowActions}>
            <IconButton
              aria-label={localization.rowActions}
              onClick={handleOpenRowActionMenu}
              size="small"
              sx={commonIconButtonStyles}
              {...rest}
            >
              <MoreHorizIcon />
            </IconButton>
          </Tooltip>
          <MRT_RowActionMenu
            anchorEl={anchorEl}
            handleEdit={handleStartEditMode}
            row={row}
            setAnchorEl={setAnchorEl}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        </>
      ) : null}
    </>
  )
}
