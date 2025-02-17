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
  const [open, setOpen] = React.useState(false)
  const columns = table.getAllColumns().filter((column) => column.getCanSort())

  return (
    <Sortable
      value={sorting}
      onValueChange={onSortingChange}
      getItemValue={(item) => item.id}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowDownUp className="size-3" aria-hidden="true" />
            Sort
            {sorting.length > 0 && (
              <Badge
                variant="secondary"
                className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
              >
                {sorting.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100vw-theme(spacing.20))] min-w-72 max-w-[25rem] p-4 sm:w-[25rem]"
          align="start"
        >
          {sorting.length > 0 ? (
            <h4 className="mb-4 font-medium leading-none">Sort by</h4>
          ) : (
            <div className="mb-4 flex flex-col gap-1">
              <h4 className="font-medium leading-none">No sorting applied</h4>
              <p className="text-muted-foreground text-sm">
                Add sorting to organize your results.
              </p>
            </div>
          )}
          <SortableContent asChild>
            <div className="flex max-h-40 flex-col gap-2 overflow-y-auto p-0.5">
              {sorting.map((sort) => (
                <SortableItem key={sort.id} value={sort.id} asChild>
                  <div className="flex items-center gap-2">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          role="combobox"
                          className="h-8 w-44 justify-between gap-2 rounded"
                        >
                          <span className="truncate">
                            {columns.find((col) => col.id === sort.id)
                              ?.columnDef.meta?.title ?? sort.id}
                          </span>
                          <ChevronsUpDown
                            className="size-4 shrink-0 opacity-50"
                            aria-hidden="true"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Search columns..." />
                          <CommandList>
                            <CommandEmpty>No column found.</CommandEmpty>
                            <CommandGroup>
                              {columns.map((column) => (
                                <CommandItem
                                  key={column.id}
                                  value={column.id}
                                  onSelect={() => {
                                    const newSorting = sorting.map((s) =>
                                      s.id === sort.id
                                        ? { ...s, id: column.id }
                                        : s,
                                    )
                                    table.setSorting(newSorting)
                                  }}
                                >
                                  <span className="mr-2 truncate">
                                    {column.columnDef.meta?.title ?? column.id}
                                  </span>
                                  <Check
                                    className={cn(
                                      'ml-auto size-4',
                                      column.id === sort.id
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
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
                      onValueChange={(value: 'asc' | 'desc') => {
                        const newSorting = sorting.map((s) =>
                          s.id === sort.id
                            ? { ...s, desc: value === 'desc' }
                            : s,
                        )
                        table.setSorting(newSorting)
                      }}
                    >
                      <SelectTrigger className="h-8 w-24">
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
                      onClick={() => {
                        const newSorting = sorting.filter(
                          (s) => s.id !== sort.id,
                        )
                        table.setSorting(newSorting)
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    <SortableItemHandle asChild>
                      <Button variant="outline" size="icon" className="size-8">
                        <GripVertical className="size-3.5" />
                      </Button>
                    </SortableItemHandle>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContent>
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                const firstAvailableColumn = columns.find(
                  (col) => !sorting.some((s) => s.id === col.id),
                )
                if (firstAvailableColumn) {
                  table.setSorting([
                    ...sorting,
                    { id: firstAvailableColumn.id, desc: false },
                  ])
                }
              }}
              disabled={sorting.length >= columns.length}
            >
              Add sort
            </Button>
            {sorting.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.resetSorting()}
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
