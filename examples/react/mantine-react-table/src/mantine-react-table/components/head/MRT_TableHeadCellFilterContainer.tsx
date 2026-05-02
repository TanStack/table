import { ActionIcon, Collapse, Flex, Menu, Text, Tooltip } from '@mantine/core'

import { localizedFilterOption } from '../../fns/filterFns'
import { MRT_FilterCheckbox } from '../inputs/MRT_FilterCheckbox'
import { MRT_FilterRangeFields } from '../inputs/MRT_FilterRangeFields'
import { MRT_FilterRangeSlider } from '../inputs/MRT_FilterRangeSlider'
import { MRT_FilterTextInput } from '../inputs/MRT_FilterTextInput'
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu'
import classes from './MRT_TableHeadCellFilterContainer.module.css'
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'
import type { FlexProps } from '@mantine/core'

interface Props<TData extends MRT_RowData> extends FlexProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellFilterContainer = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      icons: { IconFilterCog },
      localization,
    },
    refs: { filterInputRefs },
  } = table
  const { showColumnFilters } = state
  const { column } = header
  const { columnDef } = column

  const currentFilterOption = columnDef._filterFn
  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions
  const showChangeModeButton =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)

  return (
    <Collapse
      expanded={showColumnFilters || columnFilterDisplayMode === 'popover'}
    >
      <Flex direction="column" {...rest}>
        <Flex align="flex-end">
          {columnDef.filterVariant === 'checkbox' ? (
            <MRT_FilterCheckbox column={column} table={table} />
          ) : columnDef.filterVariant === 'range-slider' ? (
            <MRT_FilterRangeSlider header={header} table={table} />
          ) : ['date-range', 'range'].includes(columnDef.filterVariant ?? '') ||
            ['between', 'betweenInclusive', 'inNumberRange'].includes(
              columnDef._filterFn,
            ) ? (
            <MRT_FilterRangeFields header={header} table={table} />
          ) : (
            <MRT_FilterTextInput header={header} table={table} />
          )}
          {showChangeModeButton && (
            <Menu withinPortal={columnFilterDisplayMode !== 'popover'}>
              <Tooltip
                label={localization.changeFilterMode}
                position="bottom-start"
                withinPortal
              >
                <Menu.Target>
                  <ActionIcon
                    aria-label={localization.changeFilterMode}
                    color="gray"
                    size="md"
                    variant="subtle"
                  >
                    <IconFilterCog />
                  </ActionIcon>
                </Menu.Target>
              </Tooltip>
              <MRT_FilterOptionMenu
                header={header}
                onSelect={() =>
                  setTimeout(
                    () => filterInputRefs.current[`${column.id}-0`]?.focus(),
                    100,
                  )
                }
                table={table}
              />
            </Menu>
          )}
        </Flex>
        {showChangeModeButton ? (
          <Text
            c="dimmed"
            className={classes['filter-mode-label']}
            component="label"
          >
            {localization.filterMode.replace(
              '{filterType}',
              localizedFilterOption(localization, currentFilterOption),
            )}
          </Text>
        ) : null}
      </Flex>
    </Collapse>
  )
}
