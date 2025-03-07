'use client'

import * as React from 'react'
import { ListFilter, Trash2 } from 'lucide-react'
import type { ExtendedColumnFilter } from '@/main'
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

type Features<TFeatures extends TableFeatures> = Pick<
  TFeatures,
  'columnFilteringFeature' | 'columnFacetingFeature'
>

interface DataTableFilterListProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<Features<TFeatures>, TData>
  columnFilters: Array<ExtendedColumnFilter>
  onColumnFiltersChange: React.Dispatch<
    React.SetStateAction<Array<ExtendedColumnFilter>>
  >
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
      column: Column<Features<TFeatures>, TData>,
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
    (column: Column<Features<TFeatures>, TData>) => {
      const facetedUniqueValues = column.getFacetedUniqueValues()
      return Array.from(facetedUniqueValues.keys())
        .map((value) => ({
          label: String(value),
          value,
        }))
        .slice(0, 50)
    },
    [table],
  )

  function getFilterOperators(type: string) {
    switch (type) {
      case 'text':
        return [
          { label: 'Contains', value: 'includesString' },
          { label: 'Does not contain', value: 'notIncludesString' },
          { label: 'Is', value: 'equalsString' },
          { label: 'Is not', value: 'notEqualsString' },
          { label: 'Starts with', value: 'startsWith' },
          { label: 'Ends with', value: 'endsWith' },
          { label: 'Is empty', value: 'isEmpty' },
          { label: 'Is not empty', value: 'isNotEmpty' },
        ]
      case 'number':
        return [
          { label: 'Is', value: 'equals' },
          { label: 'Is not', value: 'notEquals' },
          { label: 'Is less than', value: 'lessThan' },
          { label: 'Is less than or equal to', value: 'lessThanOrEqualTo' },
          { label: 'Is greater than', value: 'greaterThan' },
          {
            label: 'Is greater than or equal to',
            value: 'greaterThanOrEqualTo',
          },
          { label: 'Is in range', value: 'inNumberRange' },
        ]
      case 'date':
        return [
          { label: 'Is', value: 'equals' },
          { label: 'Is not', value: 'notEquals' },
          { label: 'Is before', value: 'lessThan' },
          { label: 'Is on or before', value: 'lessThanOrEqualTo' },
          { label: 'Is after', value: 'greaterThan' },
          { label: 'Is on or after', value: 'greaterThanOrEqualTo' },
          { label: 'Is in range', value: 'inNumberRange' },
        ]
      case 'boolean':
        return [
          { label: 'Is true', value: 'equals-true' },
          { label: 'Is false', value: 'equals-false' },
        ]
      case 'array':
        return [
          { label: 'Includes', value: 'arrIncludes' },
          { label: 'Includes all', value: 'arrIncludesAll' },
          { label: 'Includes some', value: 'arrIncludesSome' },
        ]
      default:
        return [
          { label: 'Contains', value: 'includesString' },
          { label: 'Does not contain', value: 'notIncludesString' },
          { label: 'Is', value: 'equalsString' },
          { label: 'Is not', value: 'notEqualsString' },
        ]
    }
  }

  const createFilterRow = React.useCallback(
    (columnId: string) => {
      const column = filterableColumns.find((col) => col.id === columnId)
      if (!column) return null

      const filterType = getColumnFilterType(column)
      const operators = getFilterOperators(filterType ?? 'text')
      const defaultOperator = operators[0].value

      return {
        id: columnId,
        value: filterType === 'multi-select' ? [] : '',
        operator: defaultOperator,
        rowId: crypto.randomUUID(),
      }
    },
    [filterableColumns, getColumnFilterType],
  )

  const addFilterRow = React.useCallback(() => {
    const firstFilterableColumn = filterableColumns[0]

    const newFilter = createFilterRow(firstFilterableColumn.id)
    if (newFilter) {
      onColumnFiltersChange([...columnFilters, newFilter])
    }
  }, [columnFilters, createFilterRow, filterableColumns, onColumnFiltersChange])

  const updateFilterRow = React.useCallback(
    (rowId: string, updates: Partial<ExtendedColumnFilter>) => {
      const newFilters = columnFilters.map((filter) => {
        if (filter.rowId === rowId) {
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
      getFilterOperators,
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

  const renderFilterInput = React.useCallback(
    (
      column: Column<Features<TFeatures>, TData>,
      operator: string,
      rowId: string,
    ) => {
      const filterType = getColumnFilterType(column)
      const currentFilter = columnFilters.find(
        (filter) => filter.rowId === rowId,
      )

      switch (filterType) {
        default:
          return (
            <Input
              type="text"
              value={(currentFilter?.value ?? '') as string}
              placeholder={`Search ${
                column.columnDef.meta?.label ?? column.id
              }...`}
              className="h-8 w-[150px]"
              onChange={(event) => {
                if (rowId) {
                  updateFilterRow(rowId, {
                    value: event.target.value,
                    operator,
                  })
                }
              }}
            />
          )
      }
    },
    [
      getColumnFilterType,
      getFacetedUniqueValues,
      columnFilters,
      updateFilterRow,
    ],
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
          {renderFilterInput(
            column,
            filter.operator ?? 'contains',
            filter.rowId,
          )}
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
