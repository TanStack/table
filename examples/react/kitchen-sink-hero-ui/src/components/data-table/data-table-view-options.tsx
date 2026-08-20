'use client'

import * as React from 'react'
import { Button, Checkbox, Input, Popover } from '@heroui/react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { useTableContext } from '@/hooks/table'
import { SortableFrame } from '@/components/data-table/shared'

export function DataTableViewOptions(): React.ReactNode {
  const table = useTableContext()
  const columnOrder = table.state.columnOrder
  const [query, setQuery] = React.useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const columns = table
    .getAllColumns()
    .filter((column: any) => typeof column.accessorFn !== 'undefined')
    .sort(
      (a: any, b: any) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id),
    )
    .filter((column: any) =>
      ((column.columnDef.meta?.label ?? column.id) as string)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const current = columnOrder
    const oldIndex = current.indexOf(String(active.id))
    const newIndex = current.indexOf(String(over.id))
    if (oldIndex >= 0 && newIndex >= 0) {
      table.setColumnOrder(arrayMove([...current], oldIndex, newIndex))
    }
  }

  return (
    <Popover>
      <Button variant="secondary" size="sm">
        View
      </Button>
      <Popover.Content className="w-80">
        <Popover.Dialog className="space-y-3 p-3">
          <Input
            aria-label="Search columns"
            placeholder="Search columns"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={columns.map((column: any) => column.id as string)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {columns.map((column: any) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <div className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/40">
                      <Checkbox
                        isSelected={column.getIsVisible()}
                        onChange={(selected: boolean) =>
                          column.toggleVisibility(selected)
                        }
                      >
                        {column.columnDef.meta?.label ?? column.id}
                      </Checkbox>
                      <span className="text-muted">{'≡'}</span>
                    </div>
                  </SortableFrame>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
