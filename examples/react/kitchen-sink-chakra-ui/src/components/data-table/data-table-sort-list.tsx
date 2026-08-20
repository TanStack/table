'use client'

import * as React from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
  Badge,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  IconArrowsSort,
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react'
import type { DragEndEvent } from '@dnd-kit/core'
import { useTableContext } from '@/hooks/table'
import {
  FloatingPanel,
  SelectField,
  SortableContext,
  SortableFrame,
  verticalListSortingStrategy,
} from '@/components/data-table/shared'

export function DataTableSortList(): React.ReactNode {
  const table = useTableContext()
  const sorting = table.state.sorting

  const [opened, setOpened] = React.useState(false)
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
    patch: Partial<{ id: string; desc: boolean }>,
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
    if (nextColumn)
      table.setSorting([...sorting, { id: nextColumn.id, desc: false }])
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
    <FloatingPanel
      open={opened}
      onOpenChange={setOpened}
      width="520px"
      trigger={
        <Button variant="outline" size="sm">
          <IconArrowsSort size={16} />
          Sort
          {sorting.length ? (
            <Badge fontSize="sm">{sorting.length}</Badge>
          ) : null}
        </Button>
      }
    >
      <Stack gap="4">
        <Text fontWeight="semibold">
          {sorting.length ? 'Sort by' : 'No sorting applied'}
        </Text>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sorting.map((sort) => sort.id)}
            strategy={verticalListSortingStrategy}
          >
            <Stack gap="2">
              {sorting.map((sort, index) => (
                <SortableFrame key={sort.id} id={sort.id}>
                  <HStack wrap="nowrap" align="flex-end">
                    <IconGripVertical size={18} opacity={0.45} />
                    <SelectField
                      label="Column"
                      options={columnOptions}
                      value={sort.id}
                      onChange={(value) => {
                        if (value) updateSort(index, { id: value })
                      }}
                      flex={1}
                    />
                    <SelectField
                      label="Direction"
                      options={[
                        { value: 'asc', label: 'Asc' },
                        { value: 'desc', label: 'Desc' },
                      ]}
                      value={sort.desc ? 'desc' : 'asc'}
                      onChange={(value) =>
                        updateSort(index, { desc: value === 'desc' })
                      }
                      width="110px"
                    />
                    <IconButton
                      variant="subtle"
                      color="red"
                      aria-label="Remove sort"
                      onClick={() =>
                        table.setSorting(
                          sorting.filter((_, sortIndex) => sortIndex !== index),
                        )
                      }
                    >
                      <IconTrash size={16} />
                    </IconButton>
                  </HStack>
                </SortableFrame>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
        <HStack>
          <Button
            size="sm"
            onClick={addSort}
            disabled={sorting.length >= sortableColumns.length}
          >
            Add sort
          </Button>
          <Button
            size="sm"
            variant="subtle"
            onClick={() => table.resetSorting()}
          >
            Reset
          </Button>
        </HStack>
      </Stack>
    </FloatingPanel>
  )
}
