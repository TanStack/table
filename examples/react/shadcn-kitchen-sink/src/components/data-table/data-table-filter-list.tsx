'use client'

import * as React from 'react'
import { CalendarIcon, ListFilter, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
  TableFilterFeatures,
} from '@/types'
import type {
  Column,
  ColumnMeta,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { getFilterOperators } from '@/lib/data-table'
import { cn } from '@/lib/utils'
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from '@/components/ui/faceted'

// TODO: column.getFacetedUniqueValues() is broken rn, remove this once it's fixed
function createManualFacetedValues<TData extends RowData>(
  table: Table<TableFilterFeatures<TableFeatures>, TData>,
  columnId: string,
): Map<unknown, number> {
  const facetedValues = new Map<unknown, number>()

  const rows = table.getPreFilteredRowModel().flatRows

  for (const row of rows) {
    const value = row.getValue(columnId)
    if (value !== undefined && value !== null) {
      const count = facetedValues.get(value) ?? 0
      facetedValues.set(value, count + 1)
    }
  }

  return facetedValues
}

function getColumnOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  column,
  table,
}: {
  column: Column<TableFilterFeatures<TFeatures>, TData>
  table: Table<TableFilterFeatures<TFeatures>, TData>
}): Array<{ label: string; value: string; count?: number }> {
  const customOptions = column.columnDef.meta?.options

  if (customOptions) return customOptions

  let uniqueValues: Map<unknown, number>
  try {
    uniqueValues = column.getFacetedUniqueValues()

    if (!(uniqueValues instanceof Map)) {
      uniqueValues = createManualFacetedValues(table, column.id)
    }
  } catch (_err) {
    uniqueValues = createManualFacetedValues(table, column.id)
  }

  return Array.from(uniqueValues.entries()).map(([value, count]) => ({
    label: String(value),
    value: String(value),
    count,
  }))
}

interface DataTableFilterListProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TableFilterFeatures<TFeatures>, TData>
  columnFilters: Array<ExtendedColumnFilter>
  onColumnFiltersChange: (filters: Array<ExtendedColumnFilter>) => void
}

export function DataTableFilterList<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  table,
  columnFilters,
  onColumnFiltersChange,
}: DataTableFilterListProps<TFeatures, TData>) {
  const id = React.useId()
  const labelId = React.useId()
  const descriptionId = React.useId()
  const [open, setOpen] = React.useState(false)

  const filterableColumns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table],
  )

  const getColumnFilterVariant = React.useCallback(
    (
      column: Column<TableFilterFeatures<TFeatures>, TData>,
    ): ColumnMeta<TFeatures, TData>['variant'] => {
      if (column.columnDef.meta?.variant) {
        return column.columnDef.meta.variant
      }

      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

      if (Array.isArray(firstValue)) return 'multi-select'
      if (typeof firstValue === 'number') return 'number'
      if (firstValue instanceof Date) return 'date'
      if (column.columnDef.meta?.variant === 'select') return 'select'

      return 'text'
    },
    [table],
  )

  const onFilterAddImpl = React.useCallback(
    (columnId: string): ExtendedColumnFilter | null => {
      const column = filterableColumns.find((col) => col.id === columnId)
      if (!column) return null

      const filterVariant = getColumnFilterVariant(column)
      const operators = getFilterOperators(filterVariant ?? 'text')
      const defaultOperator = operators[0].value

      return {
        id: columnId,
        value: filterVariant === 'multi-select' ? [] : '',
        operator: defaultOperator,
        filterId: crypto.randomUUID(),
        joinOperator: 'and',
      }
    },
    [filterableColumns, getColumnFilterVariant],
  )

  const onFilterAdd = React.useCallback(() => {
    const firstFilterableColumn = filterableColumns[0]

    const newFilter = onFilterAddImpl(firstFilterableColumn.id)
    if (newFilter) {
      onColumnFiltersChange([...columnFilters, newFilter])
    }
  }, [columnFilters, onFilterAddImpl, filterableColumns, onColumnFiltersChange])

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter, 'filterId'>>,
    ) => {
      const newFilters = columnFilters.map((filter) => {
        if (filter.filterId === filterId) {
          if (updates.id) {
            const newColumn = filterableColumns.find(
              (col) => col.id === updates.id,
            )
            if (newColumn) {
              const filterVariant = getColumnFilterVariant(newColumn)
              const operators = getFilterOperators(filterVariant ?? 'text')
              const defaultOperator = operators[0].value
              return {
                ...filter,
                ...updates,
                operator: defaultOperator,
                value: filterVariant === 'multi-select' ? [] : '',
              }
            }
          }

          if (updates.operator && filter.value) {
            const column = filterableColumns.find((col) => col.id === filter.id)
            if (column && getColumnFilterVariant(column) === 'date') {
              const currentValue = filter.value
              if (
                updates.operator === 'inRange' &&
                !Array.isArray(currentValue)
              ) {
                return {
                  ...filter,
                  ...updates,
                  value: [currentValue, undefined],
                }
              } else if (
                updates.operator !== 'inRange' &&
                Array.isArray(currentValue)
              ) {
                return {
                  ...filter,
                  ...updates,
                  value: currentValue[0] ?? '',
                }
              }
            }
          }

          return { ...filter, ...updates }
        }
        return filter
      })
      onColumnFiltersChange(newFilters)
    },
    [
      columnFilters,
      filterableColumns,
      getColumnFilterVariant,
      getFilterOperators,
      onColumnFiltersChange,
    ],
  )

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const newFilters = columnFilters.filter((filter) => {
        return filter.filterId !== filterId
      })
      onColumnFiltersChange(newFilters)
    },
    [columnFilters, onColumnFiltersChange],
  )

  const onFilterInputRender = React.useCallback(
    ({
      column,
      operator,
      filterId,
      inputId,
    }: {
      column: Column<TableFilterFeatures<TFeatures>, TData>
      operator: FilterOperator
      filterId: string
      inputId: string
    }) => {
      const filterVariant = getColumnFilterVariant(column) ?? 'text'
      const currentFilter = columnFilters.find(
        (filter) => filter.filterId === filterId,
      )
      const columnLabel = column.columnDef.meta?.label ?? column.id

      switch (filterVariant) {
        case 'date':
          if (operator === 'inRange') {
            const currentValue = Array.isArray(currentFilter?.value)
              ? currentFilter.value
              : [currentFilter?.value, undefined]

            const dateRange =
              currentValue[0] || currentValue[1]
                ? {
                    from: currentValue[0]
                      ? new Date(currentValue[0])
                      : undefined,
                    to: currentValue[1] ? new Date(currentValue[1]) : undefined,
                  }
                : undefined

            return (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={inputId}
                      aria-controls={`${inputId}-calendar`}
                      aria-label={`${columnLabel} date range filter`}
                      variant="outline"
                      size="sm"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange && 'text-muted-foreground',
                      )}
                      onPointerDown={(event) => {
                        // prevent implicit pointer capture
                        const target = event.target
                        if (!(target instanceof HTMLElement)) return
                        if (target.hasPointerCapture(event.pointerId)) {
                          target.releasePointerCapture(event.pointerId)
                        }

                        if (
                          event.button === 0 &&
                          event.ctrlKey === false &&
                          event.pointerType === 'mouse'
                        ) {
                          // prevent trigger from stealing focus
                          event.preventDefault()
                        }
                      }}
                    >
                      <CalendarIcon
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} -{' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    id={`${inputId}-calendar`}
                    className="w-auto p-0"
                    align="start"
                    onCloseAutoFocus={() => {
                      document.getElementById(inputId)?.focus({
                        preventScroll: true,
                      })
                    }}
                  >
                    <Calendar
                      mode="range"
                      aria-label={`Select ${columnLabel} date range`}
                      selected={dateRange}
                      defaultMonth={dateRange?.from}
                      onSelect={(date) => {
                        if (filterId) {
                          onFilterUpdate(filterId, {
                            value: [
                              date?.from ? date.from.toISOString() : undefined,
                              date?.to ? date.to.toISOString() : undefined,
                            ],
                            operator,
                          })
                        }
                      }}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )
          }

          const selectedDate = currentFilter?.value
            ? new Date(currentFilter.value as string)
            : undefined

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={inputId}
                  aria-controls={`${inputId}-calendar`}
                  aria-label={`${columnLabel} date filter`}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !currentFilter?.value && 'text-muted-foreground',
                  )}
                  onPointerDown={(event) => {
                    // prevent implicit pointer capture
                    // https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture
                    const target = event.target
                    if (!(target instanceof HTMLElement)) return
                    if (target.hasPointerCapture(event.pointerId)) {
                      target.releasePointerCapture(event.pointerId)
                    }

                    if (
                      event.button === 0 &&
                      event.ctrlKey === false &&
                      event.pointerType === 'mouse'
                    ) {
                      // prevent trigger from stealing focus from the active item after opening.
                      event.preventDefault()
                    }
                  }}
                >
                  <CalendarIcon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  {currentFilter?.value ? (
                    format(new Date(currentFilter.value as string), 'PP')
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                id={`${inputId}-calendar`}
                className="w-auto p-0"
                align="start"
                onCloseAutoFocus={() => {
                  document.getElementById(inputId)?.focus({
                    preventScroll: true,
                  })
                }}
              >
                <Calendar
                  mode="single"
                  aria-label={`Select ${columnLabel} date`}
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  onSelect={(date) => {
                    if (filterId) {
                      onFilterUpdate(filterId, {
                        value: date ? date.toISOString() : undefined,
                        operator,
                      })
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )
        case 'number':
          if (operator === 'inRange') {
            const currentValue = Array.isArray(currentFilter?.value)
              ? currentFilter.value
              : [currentFilter?.value, undefined]

            return (
              <div className="flex items-center gap-2">
                <Input
                  id={`${inputId}-min`}
                  type="number"
                  aria-label={`${columnLabel} minimum value`}
                  value={currentValue[0] ?? ''}
                  placeholder="Min"
                  className="h-8"
                  onChange={(event) => {
                    if (filterId) {
                      onFilterUpdate(filterId, {
                        value: [
                          event.target.value === ''
                            ? undefined
                            : Number(event.target.value),
                          currentValue[1] ?? undefined,
                        ],
                        operator,
                      })
                    }
                  }}
                />
                <Input
                  id={`${inputId}-max`}
                  type="number"
                  aria-label={`${columnLabel} maximum value`}
                  value={currentValue[1] ?? ''}
                  placeholder="Max"
                  className="h-8"
                  onChange={(event) => {
                    if (filterId) {
                      onFilterUpdate(filterId, {
                        value: [
                          currentValue[0] ?? undefined,
                          event.target.value === ''
                            ? undefined
                            : Number(event.target.value),
                        ],
                        operator,
                      })
                    }
                  }}
                />
              </div>
            )
          }

          return (
            <Input
              id={inputId}
              type="number"
              aria-label={`${columnLabel} filter value`}
              value={(currentFilter?.value ?? '') as string}
              placeholder={`Enter number...`}
              className="h-8"
              onChange={(event) => {
                if (filterId) {
                  onFilterUpdate(filterId, {
                    value:
                      event.target.value === ''
                        ? ''
                        : Number(event.target.value),
                    operator,
                  })
                }
              }}
            />
          )
        case 'select':
          const selectOptions = getColumnOptions({ column, table })

          return (
            <Faceted
              value={
                typeof currentFilter?.value === 'string'
                  ? currentFilter.value
                  : undefined
              }
              onValueChange={(value) => {
                if (filterId) {
                  onFilterUpdate(filterId, { value })
                }
              }}
            >
              <FacetedTrigger asChild>
                <Button
                  id={inputId}
                  aria-controls={`${inputId}-listbox`}
                  aria-label={`${columnLabel} filter value`}
                  variant="outline"
                  size="sm"
                  className="h-8 w-full justify-start text-left font-normal"
                >
                  <FacetedBadgeList
                    options={selectOptions}
                    placeholder={`Select ${column.columnDef.meta?.label ?? column.id}...`}
                  />
                </Button>
              </FacetedTrigger>
              <FacetedContent id={`${inputId}-listbox`}>
                <FacetedInput
                  aria-label={`Search ${columnLabel} options`}
                  placeholder={`Search ${column.columnDef.meta?.label ?? column.id}...`}
                />
                <FacetedList>
                  <FacetedEmpty>No options found.</FacetedEmpty>
                  <FacetedGroup>
                    {selectOptions.map((option) => (
                      <FacetedItem key={option.value} value={option.value}>
                        <span>{option.label}</span>
                        {option.count && (
                          <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                            {option.count}
                          </span>
                        )}
                      </FacetedItem>
                    ))}
                  </FacetedGroup>
                </FacetedList>
              </FacetedContent>
            </Faceted>
          )

        case 'multi-select':
          const multiSelectOptions = getColumnOptions({ column, table })
          const selectedValues = Array.isArray(currentFilter?.value)
            ? currentFilter.value
            : []

          return (
            <Faceted
              multiple
              value={selectedValues}
              onValueChange={(value) => {
                if (filterId) {
                  onFilterUpdate(filterId, { value })
                }
              }}
            >
              <FacetedTrigger asChild>
                <Button
                  id={inputId}
                  aria-controls={`${inputId}-listbox`}
                  aria-label={`${columnLabel} filter values`}
                  variant="outline"
                  size="sm"
                  className="h-8 w-full justify-start text-left font-normal"
                >
                  <FacetedBadgeList
                    options={multiSelectOptions}
                    placeholder={`Select ${column.columnDef.meta?.label ?? column.id}...`}
                  />
                </Button>
              </FacetedTrigger>
              <FacetedContent id={`${inputId}-listbox`}>
                <FacetedInput
                  aria-label={`Search ${columnLabel} options`}
                  placeholder={`Search ${column.columnDef.meta?.label ?? column.id}...`}
                />
                <FacetedList>
                  <FacetedEmpty>No options found.</FacetedEmpty>
                  <FacetedGroup>
                    {multiSelectOptions.map((option) => (
                      <FacetedItem key={option.value} value={option.value}>
                        <span>{option.label}</span>
                        {option.count && (
                          <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                            {option.count}
                          </span>
                        )}
                      </FacetedItem>
                    ))}
                  </FacetedGroup>
                </FacetedList>
              </FacetedContent>
            </Faceted>
          )

        default:
          if (operator === 'isEmpty' || operator === 'isNotEmpty') {
            return (
              <div
                id={inputId}
                role="status"
                aria-live="polite"
                aria-label={`${columnLabel} filter is ${
                  operator === 'isEmpty' ? 'empty' : 'not empty'
                }`}
                className="h-8 w-full rounded border border-dashed"
              />
            )
          }

          return (
            <Input
              id={inputId}
              type="text"
              aria-label={`${columnLabel} filter value`}
              value={(currentFilter?.value ?? '') as string}
              placeholder={`Search ${
                column.columnDef.meta?.label ?? column.id
              }...`}
              className="h-8"
              onChange={(event) => {
                if (filterId) {
                  onFilterUpdate(filterId, {
                    value: event.target.value,
                    operator,
                  })
                }
              }}
            />
          )
      }
    },
    [getColumnFilterVariant, columnFilters, onFilterUpdate],
  )

  const onFilterRender = React.useCallback(
    ({ filter, index }: { filter: ExtendedColumnFilter; index: number }) => {
      const column = table.getColumn(filter.id)
      if (!column || !filter.filterId) return null

      const filterVariant = getColumnFilterVariant(column) ?? 'text'
      const operators = getFilterOperators(filterVariant)
      const filterId = `${id}-filter-${filter.filterId}`
      const joinOperatorListboxId = `${filterId}-join-operator-listbox`
      const fieldListboxId = `${filterId}-field-listbox`
      const operatorListboxId = `${filterId}-operator-listbox`
      const inputId = `${filterId}-input`

      return (
        <div
          key={filter.filterId}
          className="grid items-center grid-cols-[70px_135px_125px_minmax(0,200px)_32px] gap-1.5 rounded"
        >
          {index === 0 ? (
            <span className="text-sm text-center text-muted-foreground">
              Where
            </span>
          ) : index === 1 ? (
            <Select
              value={filter.joinOperator}
              onValueChange={(value: JoinOperator) => {
                if (columnFilters.length > 0) {
                  const updatedFilters = columnFilters.map((f) => ({
                    ...f,
                    joinOperator: value,
                  }))
                  onColumnFiltersChange(updatedFilters)
                }
              }}
            >
              <SelectTrigger
                className="h-8"
                aria-label="Select join operator"
                aria-controls={joinOperatorListboxId}
              >
                <SelectValue placeholder="Join" />
              </SelectTrigger>
              <SelectContent
                id={joinOperatorListboxId}
                className="min-w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="and">and</SelectItem>
                <SelectItem value="or">or</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm text-center text-muted-foreground">
              {filter.joinOperator}
            </span>
          )}
          <Select
            value={filter.id}
            onValueChange={(value) => {
              if (!filter.filterId) return

              onFilterUpdate(filter.filterId, { id: value })
            }}
          >
            <SelectTrigger
              className="h-8"
              aria-label="Select filter field"
              aria-controls={fieldListboxId}
            >
              <SelectValue
                placeholder={column.columnDef.meta?.label ?? column.id}
              />
            </SelectTrigger>
            <SelectContent id={fieldListboxId}>
              {filterableColumns.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.columnDef.meta?.label ?? col.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.operator ?? 'contains'}
            onValueChange={(value: FilterOperator) => {
              if (!filter.filterId) return

              onFilterUpdate(filter.filterId, {
                operator: value,
              })
            }}
          >
            <SelectTrigger
              className="h-8"
              aria-label="Select filter operator"
              aria-controls={operatorListboxId}
            >
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent id={operatorListboxId}>
              {operators.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onFilterInputRender({
            column,
            operator: filter.operator ?? 'includesString',
            filterId: filter.filterId,
            inputId,
          })}
          <Button
            variant="outline"
            size="icon"
            className="size-8 [&_svg]:size-3.5"
            aria-label={`Remove ${column.columnDef.meta?.label ?? column.id} filter`}
            onClick={() => {
              if (!filter.filterId) return

              onFilterRemove(filter.filterId)
            }}
          >
            <Trash2 />
          </Button>
        </div>
      )
    },
    [
      table,
      filterableColumns,
      getColumnFilterVariant,
      onFilterInputRender,
      onFilterUpdate,
      onFilterRemove,
    ],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          variant="outline"
          size="sm"
          className="[&_svg]:size-3"
          onClick={(event) => event.currentTarget.focus()}
          onPointerDown={(event) => {
            const target = event.target
            if (!(target instanceof HTMLElement)) return
            if (target.hasPointerCapture(event.pointerId)) {
              target.releasePointerCapture(event.pointerId)
            }

            if (
              event.button === 0 &&
              event.ctrlKey === false &&
              event.pointerType === 'mouse'
            ) {
              event.preventDefault()
            }
          }}
        >
          <ListFilter />
          Filter
          {columnFilters.length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
            >
              {columnFilters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex origin-[var(--radix-popover-content-transform-origin)] flex-col p-4 w-[calc(100vw-theme(spacing.12))] min-w-60 sm:min-w-80 sm:w-fit"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h4 id={labelId} className="font-medium leading-none">
              Filters
            </h4>
            <p
              id={descriptionId}
              className={cn(
                'text-sm text-muted-foreground',
                columnFilters.length > 0 && 'sr-only',
              )}
            >
              {columnFilters.length > 0
                ? 'Modify filters to refine your results.'
                : 'Add filters to refine your results.'}
            </p>
          </div>
          {columnFilters.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {columnFilters.map((filter, index) =>
                  onFilterRender({ filter, index }),
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onFilterAdd} aria-label="Add new filter">
              Add filter
            </Button>
            {columnFilters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onColumnFiltersChange([])}
                aria-label="Reset all filters"
              >
                Reset filters
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
