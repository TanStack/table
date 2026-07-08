import * as React from 'react'
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
import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  Input,
  Popover,
} from 'react-aria-components'
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
    .filter((column) => typeof column.accessorFn !== 'undefined')
    .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))
    .filter((column) =>
      (column.columnDef.meta?.label ?? column.id)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = columnOrder.indexOf(String(active.id))
    const newIndex = columnOrder.indexOf(String(over.id))
    if (oldIndex >= 0 && newIndex >= 0) {
      table.setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex))
    }
  }

  return (
    <DialogTrigger>
      <Button>View</Button>
      <Popover className="react-aria-Popover w-80">
        <Dialog className="space-y-3 p-3">
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
              items={columns.map((column) => column.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {columns.map((column) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <div className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/40">
                      <Checkbox
                        isSelected={column.getIsVisible()}
                        onChange={(selected) =>
                          column.toggleVisibility(selected)
                        }
                      >
                        {column.columnDef.meta?.label ?? column.id}
                      </Checkbox>
                      <span className="text-muted">&#x2261;</span>
                    </div>
                  </SortableFrame>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
