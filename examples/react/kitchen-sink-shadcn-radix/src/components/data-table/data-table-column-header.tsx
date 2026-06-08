'use client'

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  Group,
  Pin,
  PinOff,
  Ungroup,
} from 'lucide-react'
import type { CellData, Column, RowData } from '@tanstack/react-table'
import type { features } from '@/main'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/**
 * Per-column header dropdown that consolidates the v9 column actions:
 * sort asc/desc, group by, pin left/right, unpin, and hide. Items are
 * conditionally rendered based on `column.getCan*()` so it's safe to use
 * even when some features are not registered.
 *
 * Inspired by the shadcn data-table docs `DataTableColumnHeader` component
 * (https://ui.shadcn.com/docs/components/radix/data-table) but extended to
 * cover grouping and pinning since the kitchen-sink uses the full v9 surface.
 */
interface DataTableColumnHeaderProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<typeof features, TData, TValue>
  title: string
}

export function DataTableColumnHeader<
  TData extends RowData,
  TValue extends CellData = CellData,
>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()

  // No actions available — render the title plain.
  if (!canSort && !canHide && !canPin && !canGroup) {
    return <div className={cn(className)}>{title}</div>
  }

  const sorted = canSort ? column.getIsSorted() : false
  const pinned = canPin ? column.getIsPinned() : false
  const grouped = canGroup ? column.getIsGrouped() : false

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="group -ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {sorted === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : sorted === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : canSort ? (
              <ChevronsUpDown className="ml-2 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=open]:opacity-100" />
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="mr-2 size-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="mr-2 size-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
            </>
          )}
          {canGroup && (
            <>
              {canSort ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem onClick={column.getToggleGroupingHandler()}>
                {grouped ? (
                  <>
                    <Ungroup className="mr-2 size-3.5 text-muted-foreground/70" />
                    Ungroup
                  </>
                ) : (
                  <>
                    <Group className="mr-2 size-3.5 text-muted-foreground/70" />
                    Group by
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
          {canPin && (
            <>
              {canSort || canGroup ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                onClick={() => column.pin('left')}
                disabled={pinned === 'left'}
              >
                <Pin className="mr-2 size-3.5 text-muted-foreground/70" />
                Pin left
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.pin('right')}
                disabled={pinned === 'right'}
              >
                <Pin className="mr-2 size-3.5 rotate-180 text-muted-foreground/70" />
                Pin right
              </DropdownMenuItem>
              {pinned ? (
                <DropdownMenuItem onClick={() => column.pin(false)}>
                  <PinOff className="mr-2 size-3.5 text-muted-foreground/70" />
                  Unpin
                </DropdownMenuItem>
              ) : null}
            </>
          )}
          {canHide && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 size-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
