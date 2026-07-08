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
import { Subscribe } from '@tanstack/react-table'
import { useHeaderContext, useTableContext } from '@/hooks/table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function ColumnHeader({
  title,
  className,
}: {
  title?: string
  className?: string
}): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()
  const column = header.column

  const displayTitle = column.columnDef.meta?.label ?? title ?? column.id

  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()

  if (!canSort && !canHide && !canPin && !canGroup) {
    return <div className={cn(className)}>{displayTitle}</div>
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Subscribe
        source={table.store}
        selector={(s) => ({
          sorting: s.sorting,
          grouping: s.grouping,
          columnPinning: s.columnPinning,
        })}
      >
        {() => {
          const sorted = canSort ? column.getIsSorted() : false
          const pinned = canPin ? column.getIsPinned() : false
          const grouped = canGroup ? column.getIsGrouped() : false

          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group -ml-3 h-8 data-[state=open]:bg-accent"
                  />
                }
              >
                <span>{displayTitle}</span>
                {sorted === 'desc' ? (
                  <ArrowDown className="ml-2 size-4" />
                ) : sorted === 'asc' ? (
                  <ArrowUp className="ml-2 size-4" />
                ) : canSort ? (
                  <ChevronsUpDown className="ml-2 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=open]:opacity-100" />
                ) : null}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {canSort && (
                  <>
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(false)}
                    >
                      <ArrowUp className="mr-2 size-3.5 text-muted-foreground/70" />
                      Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(true)}
                    >
                      <ArrowDown className="mr-2 size-3.5 text-muted-foreground/70" />
                      Desc
                    </DropdownMenuItem>
                  </>
                )}
                {canGroup && (
                  <>
                    {canSort ? <DropdownMenuSeparator /> : null}
                    <DropdownMenuItem
                      onClick={column.getToggleGroupingHandler()}
                    >
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
                    <DropdownMenuItem
                      onClick={() => column.toggleVisibility(false)}
                    >
                      <EyeOff className="mr-2 size-3.5 text-muted-foreground/70" />
                      Hide
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }}
      </Subscribe>
    </div>
  )
}
