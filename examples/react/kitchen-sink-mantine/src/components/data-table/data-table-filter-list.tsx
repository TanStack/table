'use client'

import * as React from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  MultiSelect,
  Popover,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { IconFilter, IconTrash } from '@tabler/icons-react'
import type { Column, RowData } from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { features } from '@/hooks/features'

type AppColumn = Column<typeof features, RowData, any>
import { useTableContext } from '@/hooks/table'
import { getFilterOperators } from '@/lib/data-table'
import { toDateInputValue } from '@/components/data-table/shared'

function FilterValueInput({
  column,
  filter,
  onFilterUpdate,
}: {
  column: Column<typeof features, RowData>
  filter: ExtendedColumnFilter
  onFilterUpdate: (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => void
}): React.ReactNode {
  if (!filter.filterId) return null
  const variant = column.columnDef.meta?.variant ?? 'text'
  const operator = filter.operator ?? 'includesString'
  const disabled = operator === 'isEmpty' || operator === 'isNotEmpty'

  if (disabled) {
    return <Text c="dimmed">No value required</Text>
  }

  if (variant === 'select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <Select
        label="Value"
        data={options}
        value={typeof filter.value === 'string' ? filter.value : null}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <MultiSelect
        label="Value"
        data={options}
        value={Array.isArray(filter.value) ? filter.value : []}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <Group grow>
          <TextInput
            label="From"
            type="date"
            value={toDateInputValue(value[0])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  event.currentTarget.value
                    ? new Date(event.currentTarget.value).toISOString()
                    : undefined,
                  value[1],
                ],
              })
            }
          />
          <TextInput
            label="To"
            type="date"
            value={toDateInputValue(value[1])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  value[0],
                  event.currentTarget.value
                    ? new Date(event.currentTarget.value).toISOString()
                    : undefined,
                ],
              })
            }
          />
        </Group>
      )
    }

    return (
      <TextInput
        label="Value"
        type="date"
        value={toDateInputValue(filter.value)}
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value: event.currentTarget.value
              ? new Date(event.currentTarget.value).toISOString()
              : undefined,
          })
        }
      />
    )
  }

  if (variant === 'number') {
    return (
      <TextInput
        label="Value"
        type="number"
        value={
          typeof filter.value === 'number' || typeof filter.value === 'string'
            ? filter.value
            : ''
        }
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value:
              event.currentTarget.value === ''
                ? ''
                : Number(event.currentTarget.value),
          })
        }
      />
    )
  }

  return (
    <TextInput
      label="Value"
      value={typeof filter.value === 'string' ? filter.value : ''}
      onChange={(event) =>
        onFilterUpdate(filter.filterId!, { value: event.currentTarget.value })
      }
    />
  )
}

export function DataTableFilterList(): React.ReactNode {
  const table = useTableContext()
  const columnFilters = table.state.columnFilters as Array<ExtendedColumnFilter>

  // Write through the raw controlled-state handler instead of
  // `table.setColumnFilters`: the table API auto-removes filters with empty
  // values, but a just-added filter row legitimately starts with `value: ''`
  // while the user is still building it.
  const setColumnFilters = (filters: Array<ExtendedColumnFilter>) => {
    table.options.onColumnFiltersChange?.(filters)
  }

  const [opened, setOpened] = React.useState(false)

  const filterableColumns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column: AppColumn) => column.getCanFilter()),
    [table],
  )

  const fieldOptions = React.useMemo(
    () =>
      filterableColumns.map((column: AppColumn) => ({
        value: column.id,
        label: column.columnDef.meta?.label ?? column.id,
      })),
    [filterableColumns],
  )

  const updateFilter = (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => {
    const newFilters = columnFilters.map((filter) =>
      filter.filterId === filterId ? { ...filter, ...patch } : filter,
    )
    setColumnFilters(newFilters)
  }

  const addFilter = () => {
    if (filterableColumns.length === 0) return
    const [column] = filterableColumns
    const newFilter: ExtendedColumnFilter = {
      id: column.id,
      filterId: crypto.randomUUID(),
      value: '',
      operator: 'includesString',
      joinOperator: columnFilters[0]?.joinOperator ?? 'and',
    }
    setColumnFilters([...columnFilters, newFilter])
  }

  return (
    <Popover opened={opened} onChange={setOpened} width={760} shadow="md">
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconFilter size={16} />}
          rightSection={
            columnFilters.length ? (
              <Badge size="sm">{columnFilters.length}</Badge>
            ) : null
          }
          onClick={() => setOpened((value) => !value)}
        >
          Filter
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="md">
          <Text fw={600}>Filters</Text>
          {columnFilters.map((filter, index) => {
            const column = table.getColumn(filter.id)
            if (!column || !filter.filterId) return null
            const variant = column.columnDef.meta?.variant ?? 'text'
            const operators = getFilterOperators(variant)
            return (
              <Group key={filter.filterId} align="flex-end" wrap="nowrap">
                {index === 0 ? (
                  <Text w={70} pb={8}>
                    Where
                  </Text>
                ) : index === 1 ? (
                  <Select
                    data={[
                      { value: 'and', label: 'and' },
                      { value: 'or', label: 'or' },
                    ]}
                    value={filter.joinOperator ?? 'and'}
                    onChange={(joinOperator) => {
                      if (!joinOperator) return
                      const updatedFilters = columnFilters.map((item) => ({
                        ...item,
                        joinOperator,
                      }))
                      setColumnFilters(updatedFilters)
                    }}
                    w={90}
                  />
                ) : (
                  <Text w={70} pb={8}>
                    {filter.joinOperator ?? 'and'}
                  </Text>
                )}
                <Select
                  label="Field"
                  searchable
                  data={fieldOptions}
                  value={column.id}
                  onChange={(nextColumnId) => {
                    const nextColumn = nextColumnId
                      ? table.getColumn(nextColumnId)
                      : undefined
                    if (nextColumn) {
                      updateFilter(filter.filterId!, {
                        id: nextColumn.id,
                        operator: getFilterOperators(
                          nextColumn.columnDef.meta?.variant ?? 'text',
                        )[0].value,
                        value: '',
                      })
                    }
                  }}
                  w={190}
                />
                <Select
                  label="Operator"
                  data={operators.map((operator) => ({
                    value: operator.value,
                    label: operator.label,
                  }))}
                  value={filter.operator ?? operators[0].value}
                  onChange={(operator) => {
                    if (!operator) return
                    updateFilter(filter.filterId!, {
                      operator,
                      value: '',
                    })
                  }}
                  w={180}
                />
                <Box style={{ flex: 1 }}>
                  <FilterValueInput
                    column={column}
                    filter={filter}
                    onFilterUpdate={updateFilter}
                  />
                </Box>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Remove filter"
                  onClick={() => {
                    const newFilters = columnFilters.filter(
                      (item) => item.filterId !== filter.filterId,
                    )
                    setColumnFilters(newFilters)
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            )
          })}
          <Group>
            <Button size="sm" onClick={addFilter}>
              Add filter
            </Button>
            <Button
              size="sm"
              variant="subtle"
              onClick={() => setColumnFilters([])}
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
