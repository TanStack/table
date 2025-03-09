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
  ColumnSort,
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
  const labelId = React.useId()
  const descriptionId = React.useId()
  const listId = React.useId()
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

  const onSortUpdate = React.useCallback(
    (sortId: string, updates: Partial<Omit<ColumnSort, 'id'>>) => {
      const newSorting = sorting.map((s) =>
        s.id === sortId ? { ...s, ...updates } : s,
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

  return (
    <Sortable
      value={sorting}
      onValueChange={onSortingChange}
      getItemValue={(item) => item.id}
    >
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
            <ArrowDownUp />
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
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          align="start"
          collisionPadding={16}
          className="w-[calc(100vw-theme(spacing.20))] origin-[var(--radix-popover-content-transform-origin)] flex flex-col gap-3 min-w-72 max-w-[25rem] p-4 sm:w-[25rem]"
        >
          <div className="flex flex-col gap-1">
            <h4 id={labelId} className="font-medium leading-none">
              {sorting.length > 0 ? 'Sort by' : 'No sorting applied'}
            </h4>
            <p
              id={descriptionId}
              className={cn(
                'text-muted-foreground text-sm',
                sorting.length > 0 && 'sr-only',
              )}
            >
              {sorting.length > 0
                ? 'Modify sorting to organize your results.'
                : 'Add sorting to organize your results.'}
            </p>
          </div>
          {sorting.length > 0 ? (
            <SortableContent asChild>
              <div
                role="list"
                id={listId}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                className="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-0.5"
              >
                {sorting.map((sort, index) => {
                  const columnTitle =
                    sortableColumns.find((col) => col.id === sort.id)?.columnDef
                      .meta?.label ?? sort.id
                  const sortItemId = `${listId}-item-${sort.id}`
                  const triggerId = `${listId}-${index}-trigger`
                  const fieldListboxId = `${sortItemId}-field-listbox`
                  const operatorListboxId = `${sortItemId}-operator-listbox`

                  return (
                    <SortableItem key={sort.id} value={sort.id} asChild>
                      <div
                        role="listitem"
                        id={sortItemId}
                        tabIndex={-1}
                        className="flex items-center gap-2"
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              role="combobox"
                              id={triggerId}
                              aria-controls={fieldListboxId}
                              aria-label={`Select column to sort by. Current: ${columnTitle}`}
                              variant="outline"
                              size="sm"
                              className="h-8 w-44 font-normal justify-between gap-2 focus:outline-none focus:ring-1 focus:ring-ring"
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
                              <span className="truncate">{columnTitle}</span>
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            id={fieldListboxId}
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            onCloseAutoFocus={() =>
                              document
                                .getElementById(triggerId)
                                ?.focus({ preventScroll: true })
                            }
                          >
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
                                        <span className="truncate">
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
                            onSortUpdate(sort.id, { desc: value === 'desc' })
                          }
                        >
                          <SelectTrigger
                            aria-controls={operatorListboxId}
                            aria-label={`Sort direction for ${columnTitle}`}
                            className="h-8 w-24"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            id={operatorListboxId}
                            className="min-w-[var(--radix-select-trigger-width)]"
                          >
                            <SelectItem value="asc">Asc</SelectItem>
                            <SelectItem value="desc">Desc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          aria-label={`Remove sort for ${columnTitle}`}
                          variant="outline"
                          size="icon"
                          className="size-8 [&_svg]:size-3.5 shrink-0"
                          onClick={() => onSortRemove(sort.id)}
                        >
                          <Trash2 />
                        </Button>
                        <SortableItemHandle asChild>
                          <Button
                            aria-label={`Drag to reorder ${columnTitle} sort`}
                            variant="outline"
                            size="icon"
                            className="size-8 [&_svg]:size-3.5 shrink-0"
                          >
                            <GripVertical />
                          </Button>
                        </SortableItemHandle>
                      </div>
                    </SortableItem>
                  )
                })}
              </div>
            </SortableContent>
          ) : null}
          <div className="flex items-center gap-2">
            <Button
              aria-label="Add new sort"
              size="sm"
              onClick={onSortAdd}
              disabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            {sorting.length > 0 && (
              <Button
                aria-label="Reset all sorting"
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
