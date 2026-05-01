import { useMemo } from 'react'
import Menu from '@mui/material/Menu'
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem'
import type {
  MRT_FilterOption,
  MRT_Header,
  MRT_InternalFilterOption,
  MRT_Localization,
  MRT_RowData,
  MRT_TableInstance,
} from '../../types'
import type { MenuProps } from '@mui/material/Menu'

export const mrtFilterOptions = (
  localization: MRT_Localization,
): Array<MRT_InternalFilterOption> => [
  {
    divider: false,
    label: localization.filterFuzzy,
    option: 'fuzzy',
    symbol: '≈',
  },
  {
    divider: false,
    label: localization.filterContains,
    option: 'contains',
    symbol: '*',
  },
  {
    divider: false,
    label: localization.filterStartsWith,
    option: 'startsWith',
    symbol: 'a',
  },
  {
    divider: true,
    label: localization.filterEndsWith,
    option: 'endsWith',
    symbol: 'z',
  },
  {
    divider: false,
    label: localization.filterEquals,
    option: 'equals',
    symbol: '=',
  },
  {
    divider: true,
    label: localization.filterNotEquals,
    option: 'notEquals',
    symbol: '≠',
  },
  {
    divider: false,
    label: localization.filterBetween,
    option: 'between',
    symbol: '⇿',
  },
  {
    divider: true,
    label: localization.filterBetweenInclusive,
    option: 'betweenInclusive',
    symbol: '⬌',
  },
  {
    divider: false,
    label: localization.filterGreaterThan,
    option: 'greaterThan',
    symbol: '>',
  },
  {
    divider: false,
    label: localization.filterGreaterThanOrEqualTo,
    option: 'greaterThanOrEqualTo',
    symbol: '≥',
  },
  {
    divider: false,
    label: localization.filterLessThan,
    option: 'lessThan',
    symbol: '<',
  },
  {
    divider: true,
    label: localization.filterLessThanOrEqualTo,
    option: 'lessThanOrEqualTo',
    symbol: '≤',
  },
  {
    divider: false,
    label: localization.filterEmpty,
    option: 'empty',
    symbol: '∅',
  },
  {
    divider: false,
    label: localization.filterNotEmpty,
    option: 'notEmpty',
    symbol: '!∅',
  },
]

const rangeModes = ['between', 'betweenInclusive', 'inNumberRange']
const emptyModes = ['empty', 'notEmpty']
const arrModes = ['arrIncludesSome', 'arrIncludesAll', 'arrIncludes']
const rangeVariants = ['range-slider', 'date-range', 'datetime-range', 'range']

export interface MRT_FilterOptionMenuProps<
  TData extends MRT_RowData,
> extends Partial<MenuProps> {
  anchorEl: HTMLElement | null
  header?: MRT_Header<TData>
  onSelect?: () => void
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  setFilterValue?: (filterValue: any) => void
  table: MRT_TableInstance<TData>
}

export const MRT_FilterOptionMenu = <TData extends MRT_RowData>({
  anchorEl,
  header,
  onSelect,
  setAnchorEl,
  setFilterValue,
  table,
  ...rest
}: MRT_FilterOptionMenuProps<TData>) => {
  const {
    state,
    options: {
      columnFilterModeOptions,
      globalFilterModeOptions,
      localization,
      mrtTheme: { menuBackgroundColor },
      renderColumnFilterModeMenuItems,
      renderGlobalFilterModeMenuItems,
    },
    setColumnFilterFns,
    setGlobalFilterFn,
  } = table
  const { density, globalFilterFn } = state
  const { column } = header ?? {}
  const { columnDef } = column ?? {}
  const currentFilterValue = column?.getFilterValue()

  let allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions

  if (rangeVariants.includes(columnDef?.filterVariant as string)) {
    allowedColumnFilterOptions = [
      ...rangeModes,
      ...(allowedColumnFilterOptions ?? []),
    ].filter((option) => rangeModes.includes(option))
  }

  const internalFilterOptions = useMemo(
    () =>
      mrtFilterOptions(localization).filter((filterOption) =>
        columnDef
          ? allowedColumnFilterOptions === undefined ||
            allowedColumnFilterOptions?.includes(filterOption.option)
          : (!globalFilterModeOptions ||
              globalFilterModeOptions.includes(filterOption.option)) &&
            ['contains', 'fuzzy', 'startsWith'].includes(filterOption.option),
      ),
    [],
  )

  const handleSelectFilterMode = (option: MRT_FilterOption) => {
    const prevFilterMode = columnDef?._filterFn ?? ''
    if (!header || !column) {
      // global filter mode
      setGlobalFilterFn(option)
    } else if (option !== prevFilterMode) {
      // column filter mode
      setColumnFilterFns((prev: { [key: string]: any }) => ({
        ...prev,
        [header.id]: option,
      }))

      // reset filter value and/or perform new filter render
      if (emptyModes.includes(option)) {
        // will now be empty/notEmpty filter mode
        if (
          currentFilterValue !== ' ' &&
          !emptyModes.includes(prevFilterMode)
        ) {
          column.setFilterValue(' ')
        } else if (currentFilterValue) {
          column.setFilterValue(currentFilterValue) // perform new filter render
        }
      } else if (
        columnDef?.filterVariant === 'multi-select' ||
        arrModes.includes(option)
      ) {
        // will now be array filter mode
        if (
          currentFilterValue instanceof String ||
          (currentFilterValue as Array<any>)?.length
        ) {
          column.setFilterValue([])
          setFilterValue?.([])
        } else if (currentFilterValue) {
          column.setFilterValue(currentFilterValue) // perform new filter render
        }
      } else if (
        columnDef?.filterVariant?.includes('range') ||
        rangeModes.includes(option)
      ) {
        // will now be range filter mode
        if (
          !Array.isArray(currentFilterValue) ||
          (!currentFilterValue?.every((v) => v === '') &&
            !rangeModes.includes(prevFilterMode))
        ) {
          column.setFilterValue(['', ''])
          setFilterValue?.('')
        } else {
          column.setFilterValue(currentFilterValue) // perform new filter render
        }
      } else {
        // will now be single value filter mode
        if (Array.isArray(currentFilterValue)) {
          column.setFilterValue('')
          setFilterValue?.('')
        } else if (
          currentFilterValue === ' ' &&
          emptyModes.includes(prevFilterMode)
        ) {
          column.setFilterValue(undefined)
        } else {
          column.setFilterValue(currentFilterValue) // perform new filter render
        }
      }
    }
    setAnchorEl(null)
    onSelect?.()
  }

  const filterOption =
    !!header && columnDef ? columnDef._filterFn : globalFilterFn

  return (
    <Menu
      slotProps={{
        list: {
          dense: density === 'compact',
          sx: {
            backgroundColor: menuBackgroundColor,
          },
        },
      }}
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
      disableScrollLock
      onClose={() => setAnchorEl(null)}
      open={!!anchorEl}
      {...rest}
    >
      {(header && column && columnDef
        ? (columnDef.renderColumnFilterModeMenuItems?.({
            column: column,
            internalFilterOptions,
            onSelectFilterMode: handleSelectFilterMode,
            table,
          }) ??
          renderColumnFilterModeMenuItems?.({
            column: column,
            internalFilterOptions,
            onSelectFilterMode: handleSelectFilterMode,
            table,
          }))
        : renderGlobalFilterModeMenuItems?.({
            internalFilterOptions,
            onSelectFilterMode: handleSelectFilterMode,
            table,
          })) ??
        internalFilterOptions.map(
          ({ divider, label, option, symbol }, index) => (
            <MRT_ActionMenuItem
              divider={divider}
              icon={symbol}
              key={index}
              label={label}
              onClick={() => handleSelectFilterMode(option)}
              selected={option === filterOption}
              table={table}
              value={option}
            />
          ),
        )}
    </Menu>
  )
}
