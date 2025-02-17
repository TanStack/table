'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, GripVertical, Settings2 } from 'lucide-react'
import type {
  ColumnOrderState,
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
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'

interface DataTableViewOptionsProps<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
> {
  table: Table<Pick<TFeatures, 'columnVisibilityFeature'>, TRowData>
  columnOrder: ColumnOrderState
  onColumnOrderChange: (columnOrder: ColumnOrderState) => void
}

export function DataTableViewOptions<
  TFeatures extends TableFeatures,
  TRowData extends RowData,
>({
  table,
  columnOrder,
  onColumnOrderChange,
}: DataTableViewOptionsProps<TFeatures, TRowData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const pointerTypeRef =
    React.useRef<React.PointerEvent['pointerType']>('touch')
  const [open, setOpen] = React.useState(false)

  return (
    <Sortable value={columnOrder} onValueChange={onColumnOrderChange}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            aria-label="Toggle columns"
            variant="outline"
            role="combobox"
            size="sm"
            className="ml-auto hidden h-8 gap-2 focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 lg:flex"
            onClick={(event) => {
              event.currentTarget.focus()
              if (pointerTypeRef.current !== 'mouse') {
                setOpen(true)
              }
            }}
            onPointerDown={(event) => {
              /**
               * @see https://github.com/radix-ui/primitives/blob/main/packages/react/select/src/select.tsx#L267-L299
               */
              pointerTypeRef.current = event.pointerType

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
                setOpen(true)
                // prevent trigger from stealing focus from the active item after opening.
                event.preventDefault()
              }
            }}
          >
            <Settings2 className="size-4" />
            View
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-full max-w-48 p-0"
          onCloseAutoFocus={() => triggerRef.current?.focus()}
        >
          <Command>
            <CommandInput placeholder="Search columns..." />
            <SortableContent asChild>
              <CommandList>
                <CommandEmpty>No columns found.</CommandEmpty>
                <CommandGroup>
                  {table
                    .getAllColumns()
                    .sort((a, b) => {
                      const aIndex = columnOrder.indexOf(a.id)
                      const bIndex = columnOrder.indexOf(b.id)
                      return aIndex - bIndex
                    })
                    .filter(
                      (column) => typeof column.accessorFn !== 'undefined',
                    )
                    .map((column) => (
                      <SortableItem key={column.id} value={column.id} asChild>
                        <CommandItem
                          aria-selected={column.getIsVisible()}
                          data-selected={column.getIsVisible()}
                          onSelect={() =>
                            column.toggleVisibility(!column.getIsVisible())
                          }
                        >
                          <Check
                            className={cn(
                              'size-4 shrink-0',
                              column.getIsVisible()
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          <span className="truncate">
                            {column.columnDef.meta?.title ?? column.id}
                          </span>
                          <SortableItemHandle asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto size-6"
                            >
                              <GripVertical />
                            </Button>
                          </SortableItemHandle>
                        </CommandItem>
                      </SortableItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center gap-1">
                    <CommandItem
                      onSelect={() => table.toggleAllColumnsVisible(false)}
                      className="w-full justify-center border"
                    >
                      Hide All
                    </CommandItem>
                    <CommandItem
                      onSelect={() => table.toggleAllColumnsVisible(true)}
                      className="w-full justify-center border"
                    >
                      Show All
                    </CommandItem>
                  </div>
                </CommandGroup>
              </CommandList>
            </SortableContent>
          </Command>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="bg-primary/10 size-full" />
      </SortableOverlay>
    </Sortable>
  )
}
