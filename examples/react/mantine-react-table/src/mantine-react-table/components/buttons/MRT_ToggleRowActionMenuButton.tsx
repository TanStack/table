import { ActionIcon, Tooltip } from '@mantine/core'

import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_RowActionMenu } from '../menus/MRT_RowActionMenu'
import { MRT_EditActionButtons } from './MRT_EditActionButtons'
import type {
  MRT_Cell,
  MRT_CellValue,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { MouseEvent } from 'react'

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
  cell: MRT_Cell<TData, TValue>
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleRowActionMenuButton = <TData extends MRT_RowData>({
  cell,
  row,
  table,
}: Props<TData>) => {
  const {
    state,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      icons: { IconEdit },
      localization: { edit },
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table

  const { creatingRow, editingRow } = state

  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation()
    setEditingRow({ ...row })
  }

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row')

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, table })
      ) : showEditActionButtons ? (
        <MRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) ? (
        <Tooltip label={edit} openDelay={1000} position="right" withinPortal>
          <ActionIcon
            aria-label={edit}
            color="gray"
            disabled={!!editingRow && editingRow.id !== row.id}
            onClick={handleStartEditMode}
            size="md"
            variant="subtle"
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
      ) : renderRowActionMenuItems ? (
        <MRT_RowActionMenu
          handleEdit={handleStartEditMode}
          row={row}
          table={table}
        />
      ) : null}
    </>
  )
}
