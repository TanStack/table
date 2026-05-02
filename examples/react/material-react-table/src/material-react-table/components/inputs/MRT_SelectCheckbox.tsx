import Checkbox from '@mui/material/Checkbox'
import Radio from '@mui/material/Radio'
import Tooltip from '@mui/material/Tooltip'
import {
  getIsRowSelected,
  getMRT_RowSelectionHandler,
  getMRT_SelectAllHandler,
} from '../../utils/row.utils'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'
import type { Theme } from '@mui/material/styles'
import type { RadioProps } from '@mui/material/Radio'
import type { CheckboxProps } from '@mui/material/Checkbox'
import type { MouseEvent } from 'react'

export interface MRT_SelectCheckboxProps<
  TData extends MRT_RowData,
> extends CheckboxProps {
  row?: MRT_Row<TData>
  staticRowIndex?: number
  table: MRT_TableInstance<TData>
}

export const MRT_SelectCheckbox = <TData extends MRT_RowData>({
  row,
  staticRowIndex,
  table,
  ...rest
}: MRT_SelectCheckboxProps<TData>) => {
  const {
    state,
    options: {
      enableMultiRowSelection,
      localization,
      muiSelectAllCheckboxProps,
      muiSelectCheckboxProps,
      selectAllMode,
    },
  } = table
  const { density, isLoading } = state

  const selectAll = !row

  const allRowsSelected = selectAll
    ? selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined

  const isChecked = selectAll
    ? allRowsSelected
    : getIsRowSelected({ row, table })

  const checkboxProps = {
    ...(selectAll
      ? parseFromValuesOrFunc(muiSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(muiSelectCheckboxProps, {
          row,
          staticRowIndex,
          table,
        })),
    ...rest,
  }

  const onSelectionChange = row
    ? getMRT_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined

  const onSelectAllChange = getMRT_SelectAllHandler({ table })

  const commonProps = {
    'aria-label': selectAll
      ? localization.toggleSelectAll
      : localization.toggleSelectRow,
    checked: isChecked,
    disabled:
      isLoading || (row && !row.getCanSelect()) || row?.id === 'mrt-row-create',
    slotProps: {
      input: {
        'aria-label': selectAll
          ? localization.toggleSelectAll
          : localization.toggleSelectRow,
      },
    },
    onChange: (event) => {
      event.stopPropagation()
      selectAll ? onSelectAllChange(event) : onSelectionChange!(event)
    },
    size: density === 'compact' ? 'small' : 'medium',
    ...checkboxProps,
    onClick: (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      checkboxProps?.onClick?.(e)
    },
    sx: (theme: Theme) => ({
      height: density === 'compact' ? '1.75rem' : '2.5rem',
      m: density !== 'compact' ? '-0.4rem' : undefined,
      width: density === 'compact' ? '1.75rem' : '2.5rem',
      zIndex: 0,
      ...parseFromValuesOrFunc(checkboxProps?.sx, theme),
    }),
    title: undefined,
  } as CheckboxProps | RadioProps

  return (
    <Tooltip
      {...getCommonTooltipProps()}
      title={
        checkboxProps?.title ??
        (selectAll
          ? localization.toggleSelectAll
          : localization.toggleSelectRow)
      }
    >
      {enableMultiRowSelection === false ? (
        <Radio {...(commonProps as any)} />
      ) : (
        <Checkbox
          indeterminate={
            !isChecked && selectAll
              ? table.getIsSomeRowsSelected()
              : row?.getIsSomeSelected() && row.getCanSelectSubRows()
          }
          {...commonProps}
        />
      )}
    </Tooltip>
  )
}
