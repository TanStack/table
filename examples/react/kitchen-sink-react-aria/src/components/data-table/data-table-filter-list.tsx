import {
  Button,
  Dialog,
  DialogTrigger,
  Input,
  Popover,
} from 'react-aria-components'
import type { Column, RowData } from '@tanstack/react-table'
import type { features } from '@/hooks/features'
import type { ExtendedColumnFilter } from '@/types'
import { getFilterOperators } from '@/lib/data-table'
import { useTableContext } from '@/hooks/table'
import { AriaSelect } from '@/components/data-table/shared'

function toDateInputValue(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

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

  if (disabled)
    return <div className="pb-2 text-sm text-muted">No value required</div>

  if (variant === 'select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <AriaSelect
        label="Value"
        value={typeof filter.value === 'string' ? filter.value : null}
        options={options}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
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
          {options.map((option) => (
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
    ])
  }

  return (
    <DialogTrigger>
      <Button>
        Filter{columnFilters.length ? ` (${columnFilters.length})` : ''}
      </Button>
      <Popover className="react-aria-Popover w-[760px]">
        <Dialog className="space-y-4 p-3">
          <div className="font-semibold">Filters</div>
          {columnFilters.map((filter, index) => {
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
                  <AriaSelect
                    label="Join"
                    value={filter.joinOperator ?? 'and'}
                    options={[
                      { value: 'and', label: 'and' },
                      { value: 'or', label: 'or' },
                    ]}
                    onChange={(joinOperator) =>
                      setColumnFilters(
                        columnFilters.map((item) => ({
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
                <AriaSelect
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
                <AriaSelect
                  label="Operator"
                  value={filter.operator ?? operators[0].value}
                  options={operators.map((operator) => ({
                    value: operator.value,
                    label: operator.label,
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
                  onPress={() =>
                    setColumnFilters(
                      columnFilters.filter(
                        (item) => item.filterId !== filter.filterId,
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
            <Button onPress={addFilter}>Add filter</Button>
            <Button onPress={() => setColumnFilters([])}>Reset</Button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
