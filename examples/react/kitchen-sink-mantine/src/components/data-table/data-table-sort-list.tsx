'use client'

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
  ActionIcon,
  Badge,
  Button,
  Group,
  Popover,
  Select,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconArrowsSort,
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Column, ColumnSort, RowData } from '@tanstack/react-table'
import type { features } from '@/hooks/features'
import { useTableContext } from '@/hooks/table'
import { SortableFrame } from '@/components/data-table/shared'

type AppColumn = Column<typeof features, RowData, any>

export function DataTableSortList(): React.ReactNode {
  const table = useTableContext()
  const sorting = table.state.sorting

  const [opened, setOpened] = React.useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const sortableColumns = React.useMemo(
    () =>
      table.getAllColumns().filter((column: AppColumn) => column.getCanSort()),
    [table],
  )

  const columnOptions = React.useMemo(
    () =>
      sortableColumns.map((column: AppColumn) => ({
        value: column.id,
        label: column.columnDef.meta?.label ?? column.id,
      })),
    [sortableColumns],
  )

  const updateSort = (index: number, patch: Partial<ColumnSort>) => {
    const newSorting = sorting.map((sort: ColumnSort, sortIndex: number) =>
      sortIndex === index ? { ...sort, ...patch } : sort,
    )
    table.setSorting(newSorting)
  }

  const addSort = () => {
    const nextColumn = sortableColumns.find(
      (column: AppColumn) =>
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
      table.setSorting(arrayMove(sorting, oldIndex, newIndex))
    }
  }

  return (
    <Popover opened={opened} onChange={setOpened} width={520} shadow="md">
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconArrowsSort size={16} />}
          rightSection={
            sorting.length ? <Badge size="sm">{sorting.length}</Badge> : null
          }
          onClick={() => setOpened((value) => !value)}
        >
          Sort
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="md">
          <Text fw={600}>
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort: ColumnSort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xs">
                {sorting.map((sort: ColumnSort, index: number) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <Group wrap="nowrap" align="flex-end">
                      <IconGripVertical size={18} opacity={0.45} />
                      <Select
                        label="Column"
                        searchable
                        data={columnOptions}
                        value={sort.id}
                        onChange={(value) => {
                          if (value) updateSort(index, { id: value })
                        }}
                        style={{ flex: 1 }}
                      />
                      <Select
                        label="Direction"
                        data={[
                          { value: 'asc', label: 'Asc' },
                          { value: 'desc', label: 'Desc' },
                        ]}
                        value={sort.desc ? 'desc' : 'asc'}
                        onChange={(value) =>
                          updateSort(index, { desc: value === 'desc' })
                        }
                        w={110}
                      />
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        aria-label="Remove sort"
                        onClick={() => {
                          const newSorting = sorting.filter(
                            (_: ColumnSort, sortIndex: number) =>
                              sortIndex !== index,
                          )
                          table.setSorting(newSorting)
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </SortableFrame>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          <Group>
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
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
