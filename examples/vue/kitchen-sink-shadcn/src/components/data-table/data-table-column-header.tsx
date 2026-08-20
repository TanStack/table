import { defineComponent } from 'vue'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  Group,
  Pin,
  PinOff,
  Ungroup,
} from '@lucide/vue'
import type { Component } from 'vue'
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

export const ColumnHeader: Component = defineComponent({
  name: 'ColumnHeader',
  props: {
    title: { type: String, default: undefined },
    class: { type: String, default: undefined },
  },
  setup(props) {
    const header = useHeaderContext()
    const table = useTableContext()
    const column = header.column

    return () => {
      const displayTitle =
        column.columnDef.meta?.label ?? props.title ?? column.id

      const canSort = column.getCanSort()
      const canHide = column.getCanHide()
      const canPin = column.getCanPin()
      const canGroup = column.getCanGroup()

      if (!canSort && !canHide && !canPin && !canGroup) {
        return <div class={cn(props.class)}>{displayTitle}</div>
      }

      // Reading these atoms keeps the trigger icon/menu state reactive.
      void table.atoms.sorting.get()
      void table.atoms.grouping.get()
      void table.atoms.columnPinning.get()

      const sorted = canSort ? column.getIsSorted() : false
      const pinned = canPin ? column.getIsPinned() : false
      const grouped = canGroup ? column.getIsGrouped() : false

      return (
        <div class={cn('flex items-center gap-2', props.class)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                class="group -ml-3 h-8 data-[state=open]:bg-accent"
              >
                <span>{displayTitle}</span>
                {sorted === 'desc' ? (
                  <ArrowDown class="ml-2 size-4" />
                ) : sorted === 'asc' ? (
                  <ArrowUp class="ml-2 size-4" />
                ) : canSort ? (
                  <ChevronsUpDown class="ml-2 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[state=open]:opacity-100" />
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {canSort && (
                <>
                  <DropdownMenuItem
                    {...{ onClick: () => column.toggleSorting(false) }}
                  >
                    <ArrowUp class="mr-2 size-3.5 text-muted-foreground/70" />
                    Asc
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    {...{ onClick: () => column.toggleSorting(true) }}
                  >
                    <ArrowDown class="mr-2 size-3.5 text-muted-foreground/70" />
                    Desc
                  </DropdownMenuItem>
                </>
              )}
              {canGroup && (
                <>
                  {canSort ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuItem
                    {...{ onClick: column.getToggleGroupingHandler() }}
                  >
                    {grouped ? (
                      <>
                        <Ungroup class="mr-2 size-3.5 text-muted-foreground/70" />
                        Ungroup
                      </>
                    ) : (
                      <>
                        <Group class="mr-2 size-3.5 text-muted-foreground/70" />
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
                    {...{
                      onClick: () => column.pin('start'),
                      disabled: pinned === 'start',
                    }}
                  >
                    <Pin class="mr-2 size-3.5 text-muted-foreground/70" />
                    Pin left
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    {...{
                      onClick: () => column.pin('end'),
                      disabled: pinned === 'end',
                    }}
                  >
                    <Pin class="mr-2 size-3.5 rotate-180 text-muted-foreground/70" />
                    Pin right
                  </DropdownMenuItem>
                  {pinned ? (
                    <DropdownMenuItem {...{ onClick: () => column.pin(false) }}>
                      <PinOff class="mr-2 size-3.5 text-muted-foreground/70" />
                      Unpin
                    </DropdownMenuItem>
                  ) : null}
                </>
              )}
              {canHide && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    {...{ onClick: () => column.toggleVisibility(false) }}
                  >
                    <EyeOff class="mr-2 size-3.5 text-muted-foreground/70" />
                    Hide
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  },
})
