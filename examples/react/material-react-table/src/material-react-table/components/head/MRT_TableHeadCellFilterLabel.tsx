import { useState } from 'react'
import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '../../utils/column.utils'
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MouseEvent } from 'react'

export interface MRT_TableHeadCellFilterLabelProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellFilterLabel = <TData extends MRT_RowData = {}>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellFilterLabelProps<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      icons: { FilterAltIcon },
      localization,
    },
    refs: { filterInputRefs },
    setShowColumnFilters,
  } = table
  const { column } = header
  const { columnDef } = column

  const filterValue = column.getFilterValue() as [string, string] | string

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const {
    currentFilterOption,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table })

  const dropdownOptions = useDropdownOptions({ header, table })

  const getSelectLabel = (index?: number) =>
    getValueAndLabel(
      dropdownOptions?.find(
        (option) =>
          getValueAndLabel(option).value ===
          (index !== undefined ? filterValue[index] : filterValue),
      ),
    ).label

  const isFilterActive =
    (Array.isArray(filterValue) && filterValue.some(Boolean)) ||
    (!!filterValue && !Array.isArray(filterValue))

  const filterTooltip =
    columnFilterDisplayMode === 'popover' && !isFilterActive
      ? localization.filterByColumn?.replace(
          '{column}',
          String(columnDef.header),
        )
      : localization.filteringByColumn
          .replace('{column}', String(columnDef.header))
          .replace(
            '{filterType}',
            currentFilterOption
              ? localization[
                  `filter${
                    currentFilterOption.charAt(0).toUpperCase() +
                    currentFilterOption.slice(1)
                  }` as keyof typeof localization
                ]
              : '',
          )
          .replace(
            '{filterValue}',
            `"${
              Array.isArray(filterValue)
                ? filterValue
                    .map((value, index) =>
                      isMultiSelectFilter ? getSelectLabel(index) : value,
                    )
                    .join(
                      `" ${isRangeFilter ? localization.and : localization.or} "`,
                    )
                : isSelectFilter
                  ? getSelectLabel()
                  : filterValue
            }"`,
          )
          .replace('" "', '')

  return (
    <>
      <Grow
        in={
          columnFilterDisplayMode === 'popover' ||
          (!!filterValue && !isRangeFilter) ||
          (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))
        }
        unmountOnExit
      >
        <Box component="span" sx={{ flex: '0 0' }}>
          <Tooltip placement="top" title={filterTooltip}>
            <IconButton
              disableRipple
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                if (columnFilterDisplayMode === 'popover') {
                  setAnchorEl(event.currentTarget)
                } else {
                  setShowColumnFilters(true)
                }
                queueMicrotask(() => {
                  filterInputRefs.current?.[`${column.id}-0`]?.focus?.()
                  filterInputRefs.current?.[`${column.id}-0`]?.select?.()
                })
                event.stopPropagation()
              }}
              size="small"
              {...rest}
              sx={(theme) => ({
                height: '16px',
                ml: '4px',
                opacity: isFilterActive ? 1 : 0.3,
                p: '8px',
                transform: 'scale(0.75)',
                transition: 'all 150ms ease-in-out',
                width: '16px',
                ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
              })}
            >
              <FilterAltIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Grow>
      {columnFilterDisplayMode === 'popover' && (
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
          disableScrollLock
          onClick={(event) => event.stopPropagation()}
          onClose={(event) => {
            // @ts-expect-error
            event.stopPropagation()
            setAnchorEl(null)
          }}
          onKeyDown={(event) => event.key === 'Enter' && setAnchorEl(null)}
          open={!!anchorEl}
          slotProps={{ paper: { sx: { overflow: 'visible' } } }}
          transformOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
        >
          <Box sx={{ p: '1rem' }}>
            <MRT_TableHeadCellFilterContainer header={header} table={table} />
          </Box>
        </Popover>
      )}
    </>
  )
}
