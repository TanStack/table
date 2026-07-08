'use client'

import * as React from 'react'
import { Button, Input, Popover } from '@heroui/react'
import type { ExtendedColumnFilter } from '@/types'
import { useTableContext } from '@/hooks/table'
import { getFilterOperators } from '@/lib/data-table'
import { HeroSelect, toDateInputValue } from '@/components/data-table/shared'

function FilterValueInput({
  column,
  filter,
  onFilterUpdate,
}: {
  column: any
  filter: ExtendedColumnFilter
  onFilterUpdate: (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => void
}) {
  if (!filter.filterId) return null
  const variant = column.columnDef.meta?.variant ?? 'text'
  const operator = filter.operator ?? 'includesString'
  const disabled = operator === 'isEmpty' || operator === 'isNotEmpty'

  if (disabled)
    return <div className="pb-2 text-sm text-muted">No value required</div>

  if (variant === 'select') {
    const options: Array<{ label: string; value: string }> =
      column.columnDef.meta?.options ?? []
    return (
      <HeroSelect
        label="Value"
        value={typeof filter.value === 'string' ? filter.value : null}
        options={options}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options: Array<{ label: string; value: string }> =
      column.columnDef.meta?.options ?? []
    const values = Array.isArray(filter.value)
      ? filter.value.map(String)
      : typeof filter.value === 'string' && filter.value
        ? [filter.value]
        : []
    return (
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Value</span>
        <select
          multiple
          className="min-h-24 rounded-md border border-border bg-background p-2"
          value={values}
          onChange={(event) =>
            onFilterUpdate(filter.filterId!, {
              value: Array.from(event.currentTarget.selectedOptions).map(
                (option) => option.value,
              ),
            })
          }
        >
          {options.map((option: { label: string; value: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label="From"
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
          <Input
            aria-label="To"
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
        </div>
      )
    }

    return (
      <Input
        aria-label="Value"
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
      <Input
        aria-label="Value"
        type="number"
        value={
          typeof filter.value === 'number' || typeof filter.value === 'string'
            ? String(filter.value)
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
    <Input
      aria-label="Value"
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

  const filterableColumns = table
    .getAllColumns()
    .filter((column: any) => column.getCanFilter())
  const fieldOptions = filterableColumns.map((column: any) => ({
    value: column.id as string,
    label: (column.columnDef.meta?.label ?? column.id) as string,
  }))

  const updateFilter = (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => {
    setColumnFilters(
      columnFilters.map((filter: ExtendedColumnFilter) =>
        filter.filterId === filterId ? { ...filter, ...patch } : filter,
      ),
    )
  }

  const addFilter = () => {
    const [column] = filterableColumns
    if (!column) return
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
    <Popover>
      <Button variant="secondary" size="sm">
        Filter{columnFilters.length ? ` (${columnFilters.length})` : ''}
      </Button>
      <Popover.Content className="w-[760px]">
        <Popover.Dialog className="space-y-4 p-3">
          <div className="font-semibold">Filters</div>
          {columnFilters.map((filter: ExtendedColumnFilter, index: number) => {
            const column = table.getColumn(filter.id)
            if (!column || !filter.filterId) return null
            const variant = column.columnDef.meta?.variant ?? 'text'
            const operators = getFilterOperators(variant)
            return (
              <div
                key={filter.filterId}
                className="grid grid-cols-[4.5rem_11rem_11rem_1fr_auto] items-end gap-2"
              >
                {index === 0 ? (
                  <div className="pb-2 text-sm">Where</div>
                ) : index === 1 ? (
                  <HeroSelect
                    label="Join"
                    value={filter.joinOperator ?? 'and'}
                    options={[
                      { value: 'and', label: 'and' },
                      { value: 'or', label: 'or' },
                    ]}
                    onChange={(joinOperator) =>
                      setColumnFilters(
                        columnFilters.map((item: ExtendedColumnFilter) => ({
                          ...item,
                          joinOperator: joinOperator as 'and' | 'or',
                        })),
                      )
                    }
                  />
                ) : (
                  <div className="pb-2 text-sm">
                    {filter.joinOperator ?? 'and'}
                  </div>
                )}
                <HeroSelect
                  label="Field"
                  value={column.id}
                  options={fieldOptions}
                  onChange={(nextColumnId) => {
                    const nextColumn = table.getColumn(nextColumnId)
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
                />
                <HeroSelect
                  label="Operator"
                  value={filter.operator ?? operators[0].value}
                  options={operators.map((op) => ({
                    value: op.value,
                    label: op.label,
                  }))}
                  onChange={(operator) =>
                    updateFilter(filter.filterId!, {
                      operator: operator as ExtendedColumnFilter['operator'],
                      value: '',
                    })
                  }
                />
                <FilterValueInput
                  column={column}
                  filter={filter}
                  onFilterUpdate={updateFilter}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() =>
                    setColumnFilters(
                      columnFilters.filter(
                        (item: ExtendedColumnFilter) =>
                          item.filterId !== filter.filterId,
                      ),
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            )
          })}
          <div className="flex gap-2">
            <Button size="sm" onPress={addFilter}>
              Add filter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => setColumnFilters([])}
            >
              Reset
            </Button>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
