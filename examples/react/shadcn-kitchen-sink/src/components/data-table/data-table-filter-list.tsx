'use client'

import * as React from 'react'
import { Check, ListFilter, Trash2 } from 'lucide-react'
import type {
  Column,
  ColumnFilter,
  ColumnFiltersState,
  ColumnMeta,
  RowData,
  Table,
  TableFeatures,
} from '@tanstack/react-table'

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

interface AdvancedFilter extends ColumnFilter {
  operator?: string
  rowId?: string
}

interface DataTableFilterListProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<
    Pick<TFeatures, 'columnFilteringFeature' | 'columnFacetingFeature'>,
    TData
  >
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: (columnFilters: ColumnFiltersState) => void
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
          { label: 'Contains', value: 'contains' },
          { label: 'Does not contain', value: 'notContains' },
          { label: 'Is', value: 'equals' },
          { label: 'Is not', value: 'notEquals' },
          { label: 'Is empty', value: 'isEmpty' },
          { label: 'Is not empty', value: 'isNotEmpty' },
        ]
      case 'number':
        return [
          { label: 'Is', value: 'equals' },
          { label: 'Is not', value: 'notEquals' },
          { label: 'Is less than', value: 'lessThan' },
          { label: 'Is less than or equal to', value: 'lessOrEqual' },
          { label: 'Is greater than', value: 'greaterThan' },
          { label: 'Is greater than or equal to', value: 'greaterOrEqual' },
          { label: 'Is empty', value: 'isEmpty' },
          { label: 'Is not empty', value: 'isNotEmpty' },
        ]
      case 'date':
        return [
          { label: 'Is', value: 'equals' },
          { label: 'Is not', value: 'notEquals' },
          { label: 'Is before', value: 'lessThan' },
          { label: 'Is after', value: 'greaterThan' },
          { label: 'Is on or before', value: 'lessOrEqual' },
          { label: 'Is on or after', value: 'greaterOrEqual' },
          { label: 'Is empty', value: 'isEmpty' },
          { label: 'Is not empty', value: 'isNotEmpty' },
        ]
      case 'select':
      case 'multi-select':
        return [
          { label: 'Is', value: 'equals' },
          { label: 'Is not', value: 'notEquals' },
          { label: 'Is empty', value: 'isEmpty' },
          { label: 'Is not empty', value: 'isNotEmpty' },
        ]
      default:
        return []
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
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={(currentFilter as Array<number>)?.[0] ?? ''}
                onChange={(e) =>
                  column.setFilterValue((old: any) => [
                    e.target.value,
                    old?.[1],
                  ])
                }
                className="h-8 w-24"
              />
              <Input
                type="number"
                placeholder="Max"
                value={(currentFilter as Array<number>)?.[1] ?? ''}
                onChange={(e) =>
                  column.setFilterValue((old: any) => [
                    old?.[0],
                    e.target.value,
                  ])
                }
                className="h-8 w-24"
              />
            </div>
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="[&_svg]:size-3"
          onClick={(event) => event.currentTarget.focus()}
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
        className="flex w-[calc(100vw-theme(spacing.12))] min-w-60 origin-[var(--radix-popover-content-transform-origin)] flex-col p-4 sm:w-[30rem]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Add filters to refine results.
            </p>
          </div>
          {/* Active Filters */}
          {columnFilters.length > 0 && (
            <div className="flex flex-col gap-4">
              {columnFilters.length > 1 && (
                <Select
                  value={joinOperator}
                  onValueChange={(value: 'and' | 'or') =>
                    setJoinOperator(value)
                  }
                >
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue placeholder="Join type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="and">AND</SelectItem>
                    <SelectItem value="or">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <div className="flex flex-col gap-2">
                {columnFilters.map((filter) => {
                  const column = table.getColumn(filter.id)
                  if (!column) return null

                  const filterType = getColumnFilterType(column) ?? 'text'
                  const operators = getFilterOperators(filterType)
                  const advancedFilter = filter as AdvancedFilter

                  return (
                    <div key={filter.id} className="flex items-center gap-2">
                      <Select
                        value={filter.id}
                        onValueChange={(value) => {
                          const newFilters = columnFilters.map((f) =>
                            f.id === filter.id ? { ...f, id: value } : f,
                          )
                          onColumnFiltersChange(newFilters)
                        }}
                      >
                        <SelectTrigger className="h-8 w-[180px]">
                          <SelectValue
                            placeholder={
                              column.columnDef.meta?.label ?? column.id
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filterableColumns
                            .filter(
                              (col) =>
                                !columnFilters.some(
                                  (f) => f.id === col.id && f.id !== filter.id,
                                ),
                            )
                            .map((col) => (
                              <SelectItem key={col.id} value={col.id}>
                                {col.columnDef.meta?.label ?? col.id}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={advancedFilter.operator ?? 'contains'}
                        onValueChange={(value) => {
                          const newFilters = columnFilters.map((f) =>
                            f.id === filter.id ? { ...f, operator: value } : f,
                          )
                          onColumnFiltersChange(newFilters)
                        }}
                      >
                        <SelectTrigger className="h-8 w-[180px]">
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
                      {renderFilterInput(
                        column,
                        advancedFilter.operator ?? 'contains',
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 [&_svg]:size-3.5 shrink-0"
                        onClick={() => {
                          const newFilters = columnFilters.filter(
                            (f) => f.id !== filter.id,
                          )
                          onColumnFiltersChange(newFilters)
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {/* Add New Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                const firstFilterableColumn = filterableColumns[0]
                if (firstFilterableColumn) {
                  const filterType = getColumnFilterType(firstFilterableColumn)
                  const newFilter = {
                    id: firstFilterableColumn.id,
                    value: filterType === 'multi-select' ? [] : '',
                    operator: 'contains',
                    rowId: crypto.randomUUID(),
                  }
                  onColumnFiltersChange([...columnFilters, newFilter])
                }
              }}
            >
              Add filter
            </Button>
            {columnFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
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
