'use client'

import * as React from 'react'
import {
  ArrowDownUp,
  Check,
  ChevronsUpDown,
  Filter,
  Trash2,
  X,
} from 'lucide-react'
import type {
  Column,
  ColumnFiltersState,
  ColumnMeta,
  FilterFn,
  Row,
  RowData,
  Table,
  TableFeatures,
  TableState,
} from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
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
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(
    null,
  )

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
        .slice(0, 50) // Limit to first 50 unique values
    },
    [],
  )

  const renderFilterInput = React.useCallback(
    (
      column: Column<
        Pick<TFeatures, 'columnFilteringFeature' | 'columnFacetingFeature'>,
        TData
      >,
    ) => {
      const filterType = getColumnFilterType(column)
      const currentFilter = column.getFilterValue()

      switch (filterType) {
        case 'number':
          return (
            <div className="flex space-x-2">
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
            <div className="flex space-x-2">
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
          className="h-8"
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
          <Filter aria-hidden="true" />
          {columnFilters.length > 0 ? (
            <>
              {columnFilters.length} active filter
              {columnFilters.length === 1 ? '' : 's'}
            </>
          ) : (
            'Filter'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[400px] p-0">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Add filters to refine results.
            </p>
          </div>
          {/* Active Filters */}
          {columnFilters.length > 0 && (
            <div className="space-y-2">
              {columnFilters.map((filter: { id: string }) => {
                const column = table.getColumn(filter.id)
                if (!column) return null

                return (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">
                        {column.columnDef.meta?.label ?? column.id}
                      </p>
                      {renderFilterInput(column)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => column.setFilterValue(undefined)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
          {/* Add New Filter */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Select
                value={selectedColumn ?? ''}
                onValueChange={(value) => setSelectedColumn(value)}
              >
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Add filter" />
                </SelectTrigger>
                <SelectContent>
                  {filterableColumns
                    .filter(
                      (
                        column: Column<
                          Pick<TFeatures, 'columnFilteringFeature'>,
                          TData
                        >,
                      ) =>
                        !columnFilters.some(
                          (filter: { id: string }) => filter.id === column.id,
                        ),
                    )
                    .map(
                      (
                        column: Column<
                          Pick<TFeatures, 'columnFilteringFeature'>,
                          TData
                        >,
                      ) => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.columnDef.meta?.label ?? column.id}
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>
              {selectedColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    const column = table.getColumn(selectedColumn)
                    if (column) {
                      column.setFilterValue(
                        getColumnFilterType(column) === 'multi-select'
                          ? []
                          : '',
                      )
                      setSelectedColumn(null)
                    }
                  }}
                >
                  Add Filter
                </Button>
              )}
            </div>
          </div>
          {/* Reset Filters */}
          {columnFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => table.resetColumnFilters()}
            >
              Reset filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
