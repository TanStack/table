'use client'

import * as React from 'react'
import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { IconFilter, IconTrash } from '@tabler/icons-react'
import type { Column, RowData } from '@tanstack/react-table'
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from '@/types'
import type { features } from '@/hooks/features'
import { getFilterOperators } from '@/lib/data-table'
import { useTableContext } from '@/hooks/table'
import {
  FloatingPanel,
  MultiSelectField,
  SelectField,
  TextInput,
  toDateInputValue,
} from '@/components/data-table/shared'

// ---------------------------------------------------------------------------
// Filter Value Input
// ---------------------------------------------------------------------------

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
    return <Text color="fg.muted">No value required</Text>
  }

  if (variant === 'select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <SelectField
        label="Value"
        options={options}
        value={typeof filter.value === 'string' ? filter.value : null}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <MultiSelectField
        label="Value"
        options={options}
        value={Array.isArray(filter.value) ? filter.value : []}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <HStack align="flex-end" width="100%">
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
        </HStack>
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

// ---------------------------------------------------------------------------
// Filter List
// ---------------------------------------------------------------------------

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
  const filterableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter())
  const fieldOptions = filterableColumns.map((column) => ({
    value: column.id,
    label: column.columnDef.meta?.label ?? column.id,
  }))

  const updateFilter = (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => {
    setColumnFilters(
      columnFilters.map((filter) =>
        filter.filterId === filterId ? { ...filter, ...patch } : filter,
      ),
    )
  }

  const addFilter = () => {
    if (filterableColumns.length === 0) return
    const [column] = filterableColumns
    setColumnFilters([
      ...columnFilters,
      {
        id: column.id,
        filterId: crypto.randomUUID(),
        value: '',
        operator: 'includesString',
        joinOperator: columnFilters[0]?.joinOperator ?? 'and',
      },
    ] as any)
  }

  return (
    <FloatingPanel
      open={opened}
      onOpenChange={setOpened}
      width="760px"
      trigger={
        <Button variant="outline" size="sm">
          <IconFilter size={16} />
          Filter
          {columnFilters.length ? (
            <Badge fontSize="sm">{columnFilters.length}</Badge>
          ) : null}
        </Button>
      }
    >
      <Stack gap="4">
        <Text fontWeight="semibold">Filters</Text>
        {columnFilters.map((filter, index) => {
          const column = table.getColumn(filter.id)
          if (!column || !filter.filterId) return null
          const variant = column.columnDef.meta?.variant ?? 'text'
          const operators = getFilterOperators(variant)
          return (
            <HStack key={filter.filterId} align="flex-end" wrap="nowrap">
              {index === 0 ? (
                <Text width="70px" pb="8">
                  Where
                </Text>
              ) : index === 1 ? (
                <SelectField
                  options={[
                    { value: 'and', label: 'and' },
                    { value: 'or', label: 'or' },
                  ]}
                  value={filter.joinOperator ?? 'and'}
                  onChange={(joinOperator) => {
                    if (!joinOperator) return
                    setColumnFilters(
                      columnFilters.map((item) => ({
                        ...item,
                        joinOperator: joinOperator as JoinOperator,
                      })),
                    )
                  }}
                  width="90px"
                />
              ) : (
                <Text width="70px" pb="8">
                  {filter.joinOperator ?? 'and'}
                </Text>
              )}
              <SelectField
                label="Field"
                options={fieldOptions}
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
                width="190px"
              />
              <SelectField
                label="Operator"
                options={operators.map((operator) => ({
                  value: operator.value,
                  label: operator.label,
                }))}
                value={filter.operator ?? operators[0].value}
                onChange={(operator) => {
                  if (!operator) return
                  updateFilter(filter.filterId!, {
                    operator: operator as FilterOperator,
                    value: '',
                  })
                }}
                width="180px"
              />
              <Box style={{ flex: 1 }}>
                <FilterValueInput
                  column={column}
                  filter={filter}
                  onFilterUpdate={updateFilter}
                />
              </Box>
              <IconButton
                variant="subtle"
                color="red"
                aria-label="Remove filter"
                onClick={() =>
                  setColumnFilters(
                    columnFilters.filter(
                      (item) => item.filterId !== filter.filterId,
                    ),
                  )
                }
              >
                <IconTrash size={16} />
              </IconButton>
            </HStack>
          )
        })}
        <HStack>
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
        </HStack>
      </Stack>
    </FloatingPanel>
  )
}
