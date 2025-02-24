'use client'

import * as React from 'react'
import { Check, ListFilter, Trash2 } from 'lucide-react'
import type {
  Column,
  ColumnMeta,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/main'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { Badge } from '@/components/ui/badge'

interface DataTableFilterListProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<
    Pick<TFeatures, 'columnFilteringFeature' | 'columnFacetingFeature'>,
    TData
  >
  columnFilters: Array<ExtendedColumnFilter>
  onColumnFiltersChange: (columnFilters: Array<ExtendedColumnFilter>) => void
}

export function DataTableFilterList<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  table,
  columnFilters,
  onColumnFiltersChange,
}: DataTableFilterListProps<TFeatures, TData>) {
  const [open, setOpen] = React.useState(false)
  const [joinOperator, setJoinOperator] = React.useState<'and' | 'or'>('and')

  const filterableColumns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table],
  )

  const getColumnFilterType = React.useCallback(
    (
      column: Column<
        Pick<TFeatures, 'columnFilteringFeature' | 'columnFacetingFeature'>,
        TData
      >,
    ): ColumnMeta<TFeatures, TData>['type'] => {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

      if (Array.isArray(firstValue)) return 'multi-select'
      if (typeof firstValue === 'number') return 'number'
      if (firstValue instanceof Date) return 'date'
      if (column.columnDef.meta?.type === 'select') return 'select'

      return 'text'
    },
    [table],
  )

  const getFacetedUniqueValues = React.useCallback(
    (
      column: Column<
        Pick<TFeatures, 'columnFilteringFeature' | 'columnFacetingFeature'>,
        TData
      >,
    ) => {
      const facetedUniqueValues = column.getFacetedUniqueValues()
      return Array.from(facetedUniqueValues.keys())
        .map((value) => ({
          label: String(value),
          value,
        }))
        .slice(0, 50)
    },
    [],
  )

  const getFilterOperators = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { label: 'Contains', value: 'contains' as const },
          { label: 'Does not contain', value: 'notContains' as const },
          { label: 'Is', value: 'equals' as const },
          { label: 'Is not', value: 'notEquals' as const },
          { label: 'Is empty', value: 'isEmpty' as const },
          { label: 'Is not empty', value: 'isNotEmpty' as const },
        ]
      case 'number':
        return [
          { label: 'Is', value: 'equals' as const },
          { label: 'Is not', value: 'notEquals' as const },
          { label: 'Is less than', value: 'lessThan' as const },
          { label: 'Is less than or equal to', value: 'lessOrEqual' as const },
          { label: 'Is greater than', value: 'greaterThan' as const },
          {
            label: 'Is greater than or equal to',
            value: 'greaterOrEqual' as const,
          },
          { label: 'Is empty', value: 'isEmpty' as const },
          { label: 'Is not empty', value: 'isNotEmpty' as const },
        ]
      case 'date':
        return [
          { label: 'Is', value: 'equals' as const },
          { label: 'Is not', value: 'notEquals' as const },
          { label: 'Is before', value: 'lessThan' as const },
          { label: 'Is after', value: 'greaterThan' as const },
          { label: 'Is on or before', value: 'lessOrEqual' as const },
          { label: 'Is on or after', value: 'greaterOrEqual' as const },
          { label: 'Is empty', value: 'isEmpty' as const },
          { label: 'Is not empty', value: 'isNotEmpty' as const },
        ]
      case 'select':
      case 'multi-select':
        return [
          { label: 'Is', value: 'equals' as const },
          { label: 'Is not', value: 'notEquals' as const },
          { label: 'Is empty', value: 'isEmpty' as const },
          { label: 'Is not empty', value: 'isNotEmpty' as const },
        ]
      default:
        return [{ label: 'Contains', value: 'contains' as const }]
    }
  }

  const renderFilterInput = React.useCallback(
    (
      column: Column<
        Pick<TFeatures, 'columnFilteringFeature' | 'columnFacetingFeature'>,
        TData
      >,
      operator: string,
    ) => {
      const filterType = getColumnFilterType(column)
      const currentFilter = column.getFilterValue()

      if (operator === 'isEmpty' || operator === 'isNotEmpty') {
        return <div className="h-8 w-full rounded border border-dashed" />
      }

      switch (filterType) {
        case 'number':
          return (
            <Input
              type="number"
              value={(currentFilter ?? '') as string}
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder={`Enter ${column.columnDef.meta?.label ?? column.id}...`}
              className="h-8 w-[150px]"
            />
          )

        case 'date':
          return (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={(currentFilter as Array<string>)?.[0] ?? ''}
                onChange={(e) =>
                  column.setFilterValue((old: any) => [
                    e.target.value,
                    old?.[1],
                  ])
                }
                className="h-8 w-[140px]"
              />
              <Input
                type="date"
                value={(currentFilter as Array<string>)?.[1] ?? ''}
                onChange={(e) =>
                  column.setFilterValue((old: any) => [
                    old?.[0],
                    e.target.value,
                  ])
                }
                className="h-8 w-[140px]"
              />
            </div>
          )

        case 'select':
        case 'multi-select':
          const options = getFacetedUniqueValues(column)
          return (
            <Command className="rounded-md border shadow-md">
              <CommandInput
                placeholder={`Search ${
                  column.columnDef.meta?.label ?? column.id
                }...`}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={String(option.value)}
                      onSelect={() => {
                        if (filterType === 'multi-select') {
                          const currentValues =
                            (currentFilter as Array<string>) || []
                          const newValues = currentValues.includes(
                            option.value as string,
                          )
                            ? currentValues.filter((v) => v !== option.value)
                            : [...currentValues, option.value as string]
                          column.setFilterValue(
                            newValues.length ? newValues : undefined,
                          )
                        } else {
                          column.setFilterValue(
                            currentFilter === option.value
                              ? undefined
                              : option.value,
                          )
                        }
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          filterType === 'multi-select'
                            ? (currentFilter as Array<string>)?.includes(
                                option.value as string,
                              )
                            : currentFilter === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                        }`}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )

        default:
          return (
            <Input
              type="text"
              value={(currentFilter ?? '') as string}
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder={`Search ${
                column.columnDef.meta?.label ?? column.id
              }...`}
              className="h-8 w-[150px]"
            />
          )
      }
    },
    [getColumnFilterType, getFacetedUniqueValues],
  )

  // Centralized filter row management functions
  const createFilterRow = React.useCallback(
    (columnId: string) => {
      const column = filterableColumns.find((col) => col.id === columnId)
      if (!column) return null

      const filterType = getColumnFilterType(column)
      return {
        id: columnId,
        value: filterType === 'multi-select' ? [] : '',
        operator: 'contains',
        rowId: crypto.randomUUID(),
      }
    },
    [filterableColumns, getColumnFilterType],
  )

  const addFilterRow = React.useCallback(() => {
    const firstFilterableColumn = filterableColumns[0]
    if (!firstFilterableColumn) return

    const newFilter = createFilterRow(firstFilterableColumn.id)
    if (newFilter) {
      onColumnFiltersChange([...columnFilters, newFilter])
    }
  }, [columnFilters, createFilterRow, filterableColumns, onColumnFiltersChange])

  const updateFilterRow = React.useCallback(
    (rowId: string, updates: Partial<ExtendedColumnFilter>) => {
      const newFilters = columnFilters.map((filter) => {
        if (filter.rowId === rowId) {
          // If column is being changed, set the default operator based on the new column type
          if (updates.id) {
            const newColumn = filterableColumns.find(
              (col) => col.id === updates.id,
            )
            if (newColumn) {
              const filterType = getColumnFilterType(newColumn)
              const operators = getFilterOperators(filterType ?? 'text')
              const defaultOperator = operators[0].value
              return {
                ...filter,
                ...updates,
                operator: defaultOperator,
                value: filterType === 'multi-select' ? [] : '',
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
      getColumnFilterType,
      onColumnFiltersChange,
    ],
  )

  const removeFilterRow = React.useCallback(
    (rowId: string) => {
      const newFilters = columnFilters.filter((filter) => {
        return filter.rowId !== rowId
      })
      onColumnFiltersChange(newFilters)
    },
    [columnFilters, onColumnFiltersChange],
  )

  const renderFilterRow = React.useCallback(
    (filter: ExtendedColumnFilter, index: number) => {
      const column = table.getColumn(filter.id)
      if (!column || !filter.rowId) return null

      const filterType = getColumnFilterType(column) ?? 'text'
      const operators = getFilterOperators(filterType)

      return (
        <div
          key={filter.rowId}
          className="grid grid-cols-[70px_140px_130px_1fr_32px] items-center gap-2"
        >
          {index === 0 ? (
            <span className="text-sm text-center text-muted-foreground">
              Where
            </span>
          ) : index === 1 ? (
            <Select
              value={joinOperator}
              onValueChange={(value: 'and' | 'or') => setJoinOperator(value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Join" />
              </SelectTrigger>
              <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
                <SelectItem value="and">and</SelectItem>
                <SelectItem value="or">or</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm text-center text-muted-foreground">
              {joinOperator}
            </span>
          )}
          <Select
            value={filter.id}
            onValueChange={(value) =>
              updateFilterRow(filter.rowId!, { id: value })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue
                placeholder={column.columnDef.meta?.label ?? column.id}
              />
            </SelectTrigger>
            <SelectContent>
              {filterableColumns.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.columnDef.meta?.label ?? col.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.operator ?? 'contains'}
            onValueChange={(value) =>
              updateFilterRow(filter.rowId!, { operator: value })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderFilterInput(column, filter.operator ?? 'contains')}
          <Button
            variant="outline"
            size="icon"
            className="size-8 [&_svg]:size-3.5"
            onClick={() => removeFilterRow(filter.rowId!)}
          >
            <Trash2 />
          </Button>
        </div>
      )
    },
    [
      filterableColumns,
      getColumnFilterType,
      joinOperator,
      removeFilterRow,
      renderFilterInput,
      table,
      updateFilterRow,
    ],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
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
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Add filters to refine results.
            </p>
          </div>
          {columnFilters.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {columnFilters.map((filter, index) =>
                  renderFilterRow(filter, index),
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={addFilterRow}>
              Add filter
            </Button>
            {columnFilters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onColumnFiltersChange([])}
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
