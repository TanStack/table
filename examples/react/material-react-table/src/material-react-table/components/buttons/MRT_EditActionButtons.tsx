import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'
import type { BoxProps } from '@mui/material/Box'

export interface MRT_EditActionButtonsProps<
  TData extends MRT_RowData,
> extends BoxProps {
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
  variant?: 'icon' | 'text'
}

export const MRT_EditActionButtons = <TData extends MRT_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: MRT_EditActionButtonsProps<TData>) => {
  const {
    state,
    options: {
      icons: { CancelIcon, SaveIcon },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table
  const { creatingRow, editingRow, isSaving } = state

  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table })
      setCreatingRow(null)
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table })
      setEditingRow(null)
    }
    row._valuesCache = {} as any // reset values cache
  }

  const handleSubmitRow = () => {
    // look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache, input.name)
        ) {
          // @ts-expect-error
          row._valuesCache[input.name] = input.value
        }
      })
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      })
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      })
    }
  }

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        display: 'flex',
        gap: '0.75rem',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      {variant === 'icon' ? (
        <>
          <Tooltip title={localization.cancel}>
            <IconButton aria-label={localization.cancel} onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && (
            <Tooltip title={localization.save}>
              <IconButton
                aria-label={localization.save}
                color="info"
                disabled={isSaving}
                onClick={handleSubmitRow}
              >
                {isSaving ? <CircularProgress size={18} /> : <SaveIcon />}
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Button onClick={handleCancel} sx={{ minWidth: '100px' }}>
            {localization.cancel}
          </Button>
          <Button
            disabled={isSaving}
            onClick={handleSubmitRow}
            sx={{ minWidth: '100px' }}
            variant="contained"
          >
            {isSaving && <CircularProgress color="inherit" size={18} />}
            {localization.save}
          </Button>
        </>
      )}
    </Box>
  )
}
