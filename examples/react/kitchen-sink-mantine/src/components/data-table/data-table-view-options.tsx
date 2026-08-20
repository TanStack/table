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
  Button,
  Checkbox,
  Group,
  Popover,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconGripVertical, IconSettings } from '@tabler/icons-react'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Column, RowData } from '@tanstack/react-table'
import type { features } from '@/hooks/features'
import { useTableContext } from '@/hooks/table'
import { SortableFrame } from '@/components/data-table/shared'

type AppColumn = Column<typeof features, RowData, any>

export function DataTableViewOptions(): React.ReactNode {
  const table = useTableContext()
  const columnOrder = table.state.columnOrder

  const [opened, setOpened] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const columns = table
    .getAllColumns()
    .filter((column: AppColumn) => typeof column.accessorFn !== 'undefined')
    .sort(
      (a: AppColumn, b: AppColumn) =>
        columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id),
    )
    .filter((column: AppColumn) =>
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
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      shadow="md"
    >
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconSettings size={16} />}
          onClick={() => setOpened((value) => !value)}
        >
          View
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={320}>
        <Stack gap="sm">
          <TextInput
            label="Search columns"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={columns.map((column: AppColumn) => column.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap={4}>
                {columns.map((column: AppColumn) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <Group justify="space-between" wrap="nowrap">
                      <Checkbox
                        checked={column.getIsVisible()}
                        label={column.columnDef.meta?.label ?? column.id}
                        onChange={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      />
                      <IconGripVertical size={16} opacity={0.45} />
                    </Group>
                  </SortableFrame>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
