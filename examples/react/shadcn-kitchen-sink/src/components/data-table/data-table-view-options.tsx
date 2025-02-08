'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Settings2 } from 'lucide-react'
import type { RowData, Table, TableFeatures } from '@tanstack/react-table'

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
import { cn } from '@/lib/utils'

interface DataTableViewOptionsProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TFeatures, TData>
}

export function DataTableViewOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({ table }: DataTableViewOptionsProps<TFeatures, TData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const pointerTypeRef =
    React.useRef<React.PointerEvent['pointerType']>('touch')
  const [open, setOpen] = React.useState(false)

  const columns = table.getAllColumns()

  console.log({ columns })

  return (
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
        className="w-44 p-0"
        onCloseAutoFocus={() => triggerRef.current?.focus()}
      >
        {/* <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined')
                .map((column) => {
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      }
                    >
                      <span className="truncate">{column.id}</span>
                      <Check
                        className={cn(
                          'ml-auto size-4 shrink-0',
                          column.getIsVisible() ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  )
                })}
            </CommandGroup>
          </CommandList>
        </Command> */}
      </PopoverContent>
    </Popover>
  )
}
