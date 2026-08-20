'use client'

import * as React from 'react'
import { Button, Popover } from '@heroui/react'
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
import type { ColumnSort } from '@tanstack/react-table'
import { useTableContext } from '@/hooks/table'
import { HeroSelect, SortableFrame } from '@/components/data-table/shared'

export function DataTableSortList(): React.ReactNode {
  const table = useTableContext()
  const sorting = table.state.sorting

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const sortableColumns = table
    .getAllColumns()
    .filter((column: any) => column.getCanSort())
  const columnOptions = sortableColumns.map((column: any) => ({
    value: column.id as string,
    label: (column.columnDef.meta?.label ?? column.id) as string,
  }))

  const updateSort = (index: number, patch: Partial<ColumnSort>) => {
    table.setSorting(
      sorting.map((sort: ColumnSort, sortIndex: number) =>
        sortIndex === index ? { ...sort, ...patch } : sort,
      ),
    )
  }

  const addSort = () => {
    const nextColumn = sortableColumns.find(
      (column: any) =>
        !sorting.some((sort: ColumnSort) => sort.id === column.id),
    )
    if (nextColumn) {
      table.setSorting([...sorting, { id: nextColumn.id, desc: false }])
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sorting.findIndex(
      (sort: ColumnSort) => sort.id === active.id,
    )
    const newIndex = sorting.findIndex(
      (sort: ColumnSort) => sort.id === over.id,
    )
    if (oldIndex >= 0 && newIndex >= 0) {
      table.setSorting(arrayMove([...sorting], oldIndex, newIndex))
    }
  }

  return (
    <Popover>
      <Button variant="secondary" size="sm">
        Sort{sorting.length ? ` (${sorting.length})` : ''}
      </Button>
      <Popover.Content className="w-[520px]">
        <Popover.Dialog className="space-y-4 p-3">
          <div className="font-semibold">
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort: ColumnSort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sorting.map((sort: ColumnSort, index: number) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <div className="grid grid-cols-[auto_1fr_7rem_auto] items-end gap-2">
                      <span className="pb-2 text-muted">{'≡'}</span>
                      <HeroSelect
                        label="Column"
                        value={sort.id}
                        options={columnOptions}
                        onChange={(value) => updateSort(index, { id: value })}
                      />
                      <HeroSelect
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
                        variant="ghost"
                        size="sm"
                        onPress={() =>
                          table.setSorting(
                            sorting.filter(
                              (_: ColumnSort, sortIndex: number) =>
                                sortIndex !== index,
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
              size="sm"
              onPress={addSort}
              isDisabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => table.resetSorting()}
            >
              Reset
            </Button>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
