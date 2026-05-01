import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types'
import type { CheckboxProps } from '@mui/material/Checkbox'

export interface MRT_FilterCheckboxProps<
  TData extends MRT_RowData,
> extends CheckboxProps {
  column: MRT_Column<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_FilterCheckbox = <TData extends MRT_RowData>({
  column,
  table,
  ...rest
}: MRT_FilterCheckboxProps<TData>) => {
  const {
    state,
    options: { localization, muiFilterCheckboxProps },
  } = table
  const { density } = state
  const { columnDef } = column

  const checkboxProps = {
    ...parseFromValuesOrFunc(muiFilterCheckboxProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiFilterCheckboxProps, {
      column,
      table,
    }),
    ...rest,
  }

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    columnDef.header,
  )

  return (
    <Tooltip
      {...getCommonTooltipProps()}
      title={checkboxProps?.title ?? filterLabel}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={column.getFilterValue() === 'true'}
            color={
              column.getFilterValue() === undefined ? 'default' : 'primary'
            }
            indeterminate={column.getFilterValue() === undefined}
            size={density === 'compact' ? 'small' : 'medium'}
            {...checkboxProps}
            onChange={(e, checked) => {
              column.setFilterValue(
                column.getFilterValue() === undefined
                  ? 'true'
                  : column.getFilterValue() === 'true'
                    ? 'false'
                    : undefined,
              )
              checkboxProps?.onChange?.(e, checked)
            }}
            onClick={(e) => {
              e.stopPropagation()
              checkboxProps?.onClick?.(e)
            }}
            sx={(theme) => ({
              height: '2.5rem',
              width: '2.5rem',
              ...(parseFromValuesOrFunc(checkboxProps?.sx, theme) as any),
            })}
          />
        }
        disableTypography
        label={checkboxProps.title ?? filterLabel}
        sx={{ color: 'text.secondary', fontWeight: 'normal', mt: '-4px' }}
        title={undefined}
      />
    </Tooltip>
  )
}
