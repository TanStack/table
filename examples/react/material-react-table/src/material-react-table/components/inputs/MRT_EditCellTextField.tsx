import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils'
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import type { TextFieldProps } from '@mui/material/TextField'
import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_EditCellTextFieldProps<
  TData extends MRT_RowData,
> extends TextFieldProps<'standard'> {
  cell: MRT_Cell<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_EditCellTextField = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: MRT_EditCellTextFieldProps<TData>) => {
  const {
    state,
    options: { createDisplayMode, editDisplayMode, muiEditTextFieldProps },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table
  const { column, row } = cell
  const { columnDef } = column
  const { creatingRow, editingRow } = state
  const { editSelectOptions, editVariant } = columnDef

  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const [value, setValue] = useState(() => cell.getValue<string>())
  const [completesComposition, setCompletesComposition] = useState(true)

  const textFieldProps: TextFieldProps = {
    ...parseFromValuesOrFunc(muiEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  }

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  })

  const isSelectEdit = editVariant === 'select' || textFieldProps?.select

  const saveInputValueToRowCache = (newValue: string) => {
    // @ts-expect-error
    row._valuesCache[column.id] = newValue
    if (isCreating) {
      setCreatingRow(row)
    } else if (isEditing) {
      setEditingRow(row)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    textFieldProps.onChange?.(event)
    setValue(event.target.value)
    if (isSelectEdit) {
      saveInputValueToRowCache(event.target.value)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textFieldProps.onBlur?.(event)
    saveInputValueToRowCache(value)
    setEditingCell(null)
  }

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event)
    if (event.key === 'Enter' && !event.shiftKey && completesComposition) {
      editInputRefs.current?.[column.id]?.blur()
    }
  }

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>
  }

  return (
    <TextField
      disabled={parseFromValuesOrFunc(columnDef.enableEditing, row) === false}
      fullWidth
      inputRef={(inputRef) => {
        if (inputRef) {
          editInputRefs.current![column.id] = isSelectEdit
            ? inputRef.node
            : inputRef
          if (textFieldProps.inputRef) {
            textFieldProps.inputRef = inputRef
          }
        }
      }}
      label={
        ['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string,
        )
          ? columnDef.header
          : undefined
      }
      margin="none"
      name={column.id}
      placeholder={
        !['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string,
        )
          ? columnDef.header
          : undefined
      }
      select={isSelectEdit}
      size="small"
      value={value ?? ''}
      variant="standard"
      {...textFieldProps}
      slotProps={{
        ...(textFieldProps.slotProps as any),
        input: {
          ...(textFieldProps.variant !== 'outlined'
            ? { disableUnderline: editDisplayMode === 'table' }
            : {}),
          ...(textFieldProps.slotProps as any)?.input,
          sx: (theme: any) => ({
            mb: 0,
            ...parseFromValuesOrFunc(
              (textFieldProps.slotProps as any)?.input?.sx,
              theme,
            ),
          }),
        },
        select: {
          MenuProps: { disableScrollLock: true },
          ...(textFieldProps.slotProps as any)?.select,
        },
        htmlInput: {
          autoComplete: 'off',
          ...(textFieldProps.slotProps as any)?.htmlInput,
        },
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={(e) => {
        e.stopPropagation()
        textFieldProps?.onClick?.(e)
      }}
      onKeyDown={handleEnterKeyDown}
      onCompositionStart={() => setCompletesComposition(false)}
      onCompositionEnd={() => setCompletesComposition(true)}
    >
      {textFieldProps.children ??
        selectOptions?.map((option) => {
          const { label, value } = getValueAndLabel(option)
          return (
            <MenuItem
              key={value}
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: '0.5rem',
                m: 0,
              }}
              value={value}
            >
              {label}
            </MenuItem>
          )
        })}
    </TextField>
  )
}
