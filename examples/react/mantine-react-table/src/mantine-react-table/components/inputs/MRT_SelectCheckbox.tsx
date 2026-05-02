import { Checkbox, Radio, Switch, Tooltip } from '@mantine/core'
import {
  getIsRowSelected,
  getMRT_RowSelectionHandler,
  getMRT_SelectAllHandler,
} from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MouseEvent } from 'react'

import type { CheckboxProps, RadioProps, SwitchProps } from '@mantine/core'

import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'

interface Props<TData extends MRT_RowData> extends CheckboxProps {
  renderedRowIndex?: number
  row?: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_SelectCheckbox = <TData extends MRT_RowData>({
  renderedRowIndex = 0,
  row,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      enableMultiRowSelection,
      localization,
      mantineSelectAllCheckboxProps,
      mantineSelectCheckboxProps,
      selectAllMode,
      selectDisplayMode,
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
      ? parseFromValuesOrFunc(mantineSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(mantineSelectCheckboxProps, {
          row,
          table,
        })),
    ...rest,
  }

  const onSelectionChange = row
    ? getMRT_RowSelectionHandler({
        renderedRowIndex,
        row,
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
    onChange: (event) => {
      event.stopPropagation()
      if (selectAll) {
        onSelectAllChange(event)
      } else {
        onSelectionChange!(event)
      }
    },
    size: density === 'xs' ? 'sm' : 'md',
    ...checkboxProps,
    onClick: (e: MouseEvent<HTMLInputElement>) => {
      e.stopPropagation()
      checkboxProps?.onClick?.(e)
    },
    title: undefined,
  } as CheckboxProps & RadioProps & SwitchProps

  return (
    <Tooltip
      label={
        checkboxProps?.title ??
        (selectAll
          ? localization.toggleSelectAll
          : localization.toggleSelectRow)
      }
      openDelay={1000}
      withinPortal
    >
      <span>
        {selectDisplayMode === 'switch' ? (
          <Switch {...commonProps} />
        ) : selectDisplayMode === 'radio' ||
          enableMultiRowSelection === false ? (
          <Radio {...commonProps} />
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
      </span>
    </Tooltip>
  )
}
