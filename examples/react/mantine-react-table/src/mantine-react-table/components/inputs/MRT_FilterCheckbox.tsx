import clsx from 'clsx'


import { Checkbox,  Tooltip } from '@mantine/core'
import { parseFromValuesOrFunc } from '../../utils/utils'
import classes from './MRT_FilterCheckBox.module.css'
import type {CheckboxProps} from '@mantine/core';

import type {MRT_CellValue, MRT_Column, MRT_RowData, MRT_TableInstance} from '../../types';

interface Props<
  TData extends MRT_RowData,
  TValue = MRT_CellValue,
> extends CheckboxProps {
  column: MRT_Column<TData, TValue>
  table: MRT_TableInstance<TData>
}

export const MRT_FilterCheckbox = <TData extends MRT_RowData>({
  column,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: { localization, mantineFilterCheckboxProps },
  } = table
  const { density } = state
  const { columnDef } = column

  const arg = { column, table }
  const checkboxProps = {
    ...parseFromValuesOrFunc(mantineFilterCheckboxProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineFilterCheckboxProps, arg),
    ...rest,
  } as CheckboxProps

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    columnDef.header,
  )

  const value = column.getFilterValue()

  return (
    <Tooltip
      label={checkboxProps?.title ?? filterLabel}
      openDelay={1000}
      withinPortal
    >
      <Checkbox
        checked={value === 'true'}
        className={clsx('mrt-filter-checkbox', classes.root)}
        indeterminate={value === undefined}
        label={checkboxProps.title ?? filterLabel}
        size={density === 'xs' ? 'sm' : 'md'}
        {...checkboxProps}
        onChange={(e) => {
          column.setFilterValue(
            column.getFilterValue() === undefined
              ? 'true'
              : column.getFilterValue() === 'true'
                ? 'false'
                : undefined,
          )
          checkboxProps?.onChange?.(e)
        }}
        onClick={(e) => {
          e.stopPropagation()
          checkboxProps?.onClick?.(e)
        }}
        title={undefined}
      />
    </Tooltip>
  )
}
