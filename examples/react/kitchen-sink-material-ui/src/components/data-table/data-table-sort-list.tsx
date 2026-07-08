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
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import SortIcon from '@mui/icons-material/Sort'
import type { DragEndEvent } from '@dnd-kit/core'
import type { SortingState } from '@tanstack/react-table'
import { useTableContext } from '@/hooks/table'
import { SortableFrame } from '@/components/data-table/shared'

export function DataTableSortList(): React.ReactNode {
  const table = useTableContext()
  const sorting = table.state.sorting
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )
  const sortableColumns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanSort()),
    [table],
  )

  const updateSort = (index: number, patch: Partial<SortingState[number]>) => {
    const newSorting = sorting.map((sort, sortIndex) =>
      sortIndex === index ? { ...sort, ...patch } : sort,
    )
    table.setSorting(newSorting)
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
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SortIcon />}
        endIcon={
          sorting.length ? <Chip size="small" label={sorting.length} /> : null
        }
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Sort
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Stack spacing={2} sx={{ width: 480, p: 2 }}>
          <Typography variant="subtitle1">
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </Typography>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1}>
                {sorting.map((sort, index) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <DragIndicatorIcon color="disabled" />
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={sortableColumns}
                        value={
                          sortableColumns.find(
                            (column) => column.id === sort.id,
                          ) ?? null
                        }
                        getOptionLabel={(column) =>
                          column.columnDef.meta?.label ?? column.id
                        }
                        onChange={(_, column) => {
                          if (column) updateSort(index, { id: column.id })
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Column" />
                        )}
                      />
                      <FormControl size="small" sx={{ minWidth: 110 }}>
                        <InputLabel>Direction</InputLabel>
                        <Select
                          label="Direction"
                          value={sort.desc ? 'desc' : 'asc'}
                          onChange={(event) =>
                            updateSort(index, {
                              desc: event.target.value === 'desc',
                            })
                          }
                        >
                          <MenuItem value="asc">Asc</MenuItem>
                          <MenuItem value="desc">Desc</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        size="small"
                        aria-label="Remove sort"
                        onClick={() =>
                          table.setSorting(
                            sorting.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </SortableFrame>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={addSort}
              disabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            <Button size="small" onClick={() => table.resetSorting()}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}
