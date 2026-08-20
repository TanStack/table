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
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import SettingsIcon from '@mui/icons-material/Settings'
import type { DragEndEvent } from '@dnd-kit/core'
import { useTableContext } from '@/hooks/table'
import { SortableFrame } from '@/components/data-table/shared'

export function DataTableViewOptions(): React.ReactNode {
  const table = useTableContext()
  const columnOrder = table.state.columnOrder
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
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
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        View
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack spacing={1.5} sx={{ width: 300, p: 2 }}>
          <TextField
            size="small"
            label="Search columns"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
              <List dense disablePadding>
                {columns.map((column) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <DragIndicatorIcon color="disabled" fontSize="small" />
                      }
                    >
                      <ListItemButton
                        dense
                        onClick={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            size="small"
                            checked={column.getIsVisible()}
                            tabIndex={-1}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={column.columnDef.meta?.label ?? column.id}
                        />
                      </ListItemButton>
                    </ListItem>
                  </SortableFrame>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </Stack>
      </Popover>
    </>
  )
}
