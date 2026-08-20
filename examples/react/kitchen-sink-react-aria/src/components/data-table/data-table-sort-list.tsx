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
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components'
import type { DragEndEvent } from '@dnd-kit/core'
import { useTableContext } from '@/hooks/table'
import { AriaSelect, SortableFrame } from '@/components/data-table/shared'

export function DataTableSortList(): React.ReactNode {
  const table = useTableContext()
  const sorting = table.state.sorting

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )
  const sortableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanSort())
  const columnOptions = sortableColumns.map((column) => ({
    value: column.id,
    label: column.columnDef.meta?.label ?? column.id,
  }))

  const updateSort = (
    index: number,
    patch: Partial<(typeof sorting)[number]>,
  ) => {
    table.setSorting(
      sorting.map((sort, sortIndex) =>
        sortIndex === index ? { ...sort, ...patch } : sort,
      ),
    )
  }

  const addSort = () => {
    const nextColumn = sortableColumns.find(
      (column) => !sorting.some((sort) => sort.id === column.id),
    )
    if (nextColumn) {
      table.setSorting([...sorting, { id: nextColumn.id, desc: false }])
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sorting.findIndex((sort) => sort.id === active.id)
    const newIndex = sorting.findIndex((sort) => sort.id === over.id)
    if (oldIndex >= 0 && newIndex >= 0) {
      table.setSorting(arrayMove(sorting, oldIndex, newIndex))
    }
  }

  return (
    <DialogTrigger>
      <Button>Sort{sorting.length ? ` (${sorting.length})` : ''}</Button>
      <Popover className="react-aria-Popover w-[520px]">
        <Dialog className="space-y-4 p-3">
          <div className="font-semibold">
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sorting.map((sort, index) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <div className="grid grid-cols-[auto_1fr_7rem_auto] items-end gap-2">
                      <span className="pb-2 text-muted">&#x2261;</span>
                      <AriaSelect
                        label="Column"
                        value={sort.id}
                        options={columnOptions}
                        onChange={(value) => updateSort(index, { id: value })}
                      />
                      <AriaSelect
                        label="Direction"
                        value={sort.desc ? 'desc' : 'asc'}
                        options={[
                          { value: 'asc', label: 'Asc' },
                          { value: 'desc', label: 'Desc' },
                        ]}
                        onChange={(value) =>
                          updateSort(index, { desc: value === 'desc' })
                        }
                      />
                      <Button
                        onPress={() =>
                          table.setSorting(
                            sorting.filter(
                              (_, sortIndex) => sortIndex !== index,
                            ),
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </SortableFrame>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex gap-2">
            <Button
              onPress={addSort}
              isDisabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            <Button onPress={() => table.resetSorting()}>Reset</Button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
