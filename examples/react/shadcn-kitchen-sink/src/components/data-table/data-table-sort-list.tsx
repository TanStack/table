'use client'

import * as React from 'react'
import {
  ArrowDownUp,
  Check,
  ChevronsUpDown,
  GripVertical,
  Trash2,
} from 'lucide-react'
import type {
  RowData,
  SortDirection,
  SortingState,
  Table,
  TableFeatures,
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
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import { cn } from '@/lib/utils'

interface DataTableSortListProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<Pick<TFeatures, 'rowSortingFeature'>, TData>
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
}

export function DataTableSortList<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  table,
  sorting,
  onSortingChange,
}: DataTableSortListProps<TFeatures, TData>) {
  const listId = React.useId()
  const labelId = React.useId()
  const descriptionId = React.useId()

  const [open, setOpen] = React.useState(false)

  const sortableColumns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanSort()),
    [table],
  )

  const onColumnSelect = React.useCallback(
    (currentSortId: string, newColumnId: string) => {
      const newSorting = sorting.map((s) =>
        s.id === currentSortId ? { ...s, id: newColumnId } : s,
      )
      table.setSorting(newSorting)
    },
    [sorting, table],
  )

  const onSortDirectionChange = React.useCallback(
    (sortId: string, value: SortDirection) => {
      const newSorting = sorting.map((s) =>
        s.id === sortId ? { ...s, desc: value === 'desc' } : s,
      )
      table.setSorting(newSorting)
    },
    [sorting, table],
  )

  const onSortRemove = React.useCallback(
    (sortId: string) => {
      const newSorting = sorting.filter((s) => s.id !== sortId)
      table.setSorting(newSorting)
    },
    [sorting, table],
  )

  const onSortAdd = React.useCallback(() => {
    const firstAvailableColumn = sortableColumns.find(
      (col) => !sorting.some((s) => s.id === col.id),
    )
    if (firstAvailableColumn) {
      table.setSorting([
        ...sorting,
        { id: firstAvailableColumn.id, desc: false },
      ])
    }
  }, [sorting, sortableColumns, table])

  return (
    <Sortable
      value={sorting}
      onValueChange={onSortingChange}
      getItemValue={(item) => item.id}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-label={`Sort table${sorting.length > 0 ? ` (${sorting.length} active)` : ''}`}
            variant="outline"
            size="sm"
            className="[&_svg]:size-3"
          >
            <ArrowDownUp aria-hidden="true" />
            Sort
            {sorting.length > 0 && (
              <Badge
                variant="secondary"
                className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
                aria-hidden="true"
              >
                {sorting.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          align="start"
          className="w-[calc(100vw-theme(spacing.20))] flex flex-col gap-2.5 min-w-72 max-w-[25rem] p-4 sm:w-[25rem]"
        >
          <div className="flex flex-col gap-2">
            {sorting.length > 0 ? (
              <h4 id={labelId} className="font-medium leading-none">
                Sort by
              </h4>
            ) : (
              <div className="flex flex-col gap-1">
                <h4 id={labelId} className="font-medium leading-none">
                  No sorting applied
                </h4>
                <p id={descriptionId} className="text-muted-foreground text-sm">
                  Add sorting to organize your results.
                </p>
              </div>
            )}
            <SortableContent asChild>
              <div
                role="list"
                id={listId}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                className="flex max-h-40 flex-col gap-2 overflow-y-auto p-0.5"
              >
                {sorting.map((sort, index) => {
                  const columnTitle =
                    sortableColumns.find((col) => col.id === sort.id)?.columnDef
                      .meta?.label ?? sort.id

                  const itemId = `${listId}-item-${index}`

                  return (
                    <SortableItem key={sort.id} value={sort.id} asChild>
                      <div
                        role="listitem"
                        id={itemId}
                        className="flex items-center gap-2"
                      >
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <Button
                              role="combobox"
                              aria-label={`Select column to sort by. Current: ${columnTitle}`}
                              variant="outline"
                              size="sm"
                              className="h-8 w-44 justify-between gap-2 rounded"
                            >
                              <span className="truncate">{columnTitle}</span>
                              <ChevronsUpDown
                                className="size-4 shrink-0 opacity-50"
                                aria-hidden="true"
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search columns..."
                                aria-label="Search sortable columns"
                              />
                              <CommandList>
                                <CommandEmpty>No column found.</CommandEmpty>
                                <CommandGroup>
                                  {sortableColumns
                                    .filter(
                                      (column) =>
                                        !sorting.some(
                                          (s) =>
                                            s.id === column.id &&
                                            s.id !== sort.id,
                                        ),
                                    )
                                    .map((column) => (
                                      <CommandItem
                                        key={column.id}
                                        value={column.id}
                                        onSelect={() =>
                                          onColumnSelect(sort.id, column.id)
                                        }
                                      >
                                        <span className="mr-2 truncate">
                                          {column.columnDef.meta?.label ??
                                            column.id}
                                        </span>
                                        <Check
                                          className={cn(
                                            'ml-auto size-4',
                                            column.id === sort.id
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                          aria-hidden="true"
                                        />
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <Select
                          value={sort.desc ? 'desc' : 'asc'}
                          onValueChange={(value: SortDirection) =>
                            onSortDirectionChange(sort.id, value)
                          }
                        >
                          <SelectTrigger
                            className="h-8 w-24"
                            aria-label={`Sort direction for ${columnTitle}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
                            <SelectItem value="asc">Asc</SelectItem>
                            <SelectItem value="desc">Desc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => onSortRemove(sort.id)}
                          aria-label={`Remove sort for ${columnTitle}`}
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </Button>
                        <SortableItemHandle asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            aria-label={`Drag to reorder ${columnTitle} sort`}
                          >
                            <GripVertical
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </Button>
                        </SortableItemHandle>
                      </div>
                    </SortableItem>
                  )
                })}
              </div>
            </SortableContent>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onSortAdd}
              disabled={sorting.length >= sortableColumns.length}
              aria-label="Add new sort"
            >
              Add sort
            </Button>
            {sorting.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.resetSorting()}
                aria-label="Reset all sorting"
              >
                Reset
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="h-8 w-[11.25rem] rounded-md bg-primary/10" />
          <div className="h-8 w-24 rounded-md bg-primary/10" />
          <div className="size-8 shrink-0 rounded-md bg-primary/10" />
          <div className="size-8 shrink-0 rounded-md bg-primary/10" />
        </div>
      </SortableOverlay>
    </Sortable>
  )
}
