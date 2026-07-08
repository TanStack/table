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
import { Button, HStack, Stack } from '@chakra-ui/react'
import { IconGripVertical, IconSettings } from '@tabler/icons-react'
import type { DragEndEvent } from '@dnd-kit/core'
import { useTableContext } from '@/hooks/table'
import {
  CheckboxField,
  FloatingPanel,
  SortableContext,
  SortableFrame,
  TextInput,
  verticalListSortingStrategy,
} from '@/components/data-table/shared'

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
    <FloatingPanel
      open={opened}
      onOpenChange={setOpened}
      width="320px"
      trigger={
        <Button variant="outline" size="sm">
          <IconSettings size={16} />
          View
        </Button>
      }
    >
      <Stack gap="3">
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
            items={columns.map((column) => column.id)}
            strategy={verticalListSortingStrategy}
          >
            <Stack gap={4}>
              {columns.map((column) => (
                <SortableFrame key={column.id} id={column.id}>
                  <HStack justify="space-between" wrap="nowrap">
                    <CheckboxField
                      checked={column.getIsVisible()}
                      label={column.columnDef.meta?.label ?? column.id}
                      onCheckedChange={(checked) =>
                        column.toggleVisibility(checked)
                      }
                    />
                    <IconGripVertical size={16} opacity={0.45} />
                  </HStack>
                </SortableFrame>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </Stack>
    </FloatingPanel>
  )
}
