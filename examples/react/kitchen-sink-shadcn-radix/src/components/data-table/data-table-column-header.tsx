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
import type { Column, RowData, TableFeatures } from '@tanstack/react-table'

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
/**
 * Features the dropdown queries on the column. Mirrors the generic shape the
 * other `data-table-*` components use (TFeatures extends TableFeatures,
 * narrowed via Pick at the use site).
 */
type ColumnHeaderFeatureKeys =
  | 'columnGroupingFeature'
  | 'columnPinningFeature'
  | 'columnVisibilityFeature'
  | 'rowSortingFeature'

interface DataTableColumnHeaderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<Pick<TFeatures, ColumnHeaderFeatureKeys>, TData>
  title: string
}

export function DataTableColumnHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({ column, title, className }: DataTableColumnHeaderProps<TFeatures, TData>) {
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
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {sorted === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : sorted === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : canSort ? (
              <ChevronsUpDown className="ml-2 size-4" />
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
