import * as React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
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
import FilterListIcon from '@mui/icons-material/FilterList'
import type { Column, RowData } from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { features } from '@/hooks/features'
import { useTableContext } from '@/hooks/table'
import { getFilterOperators } from '@/lib/data-table'
import { toDateInputValue } from '@/components/data-table/shared'

function FilterValueInput({
  column,
  filter,
  onFilterUpdate,
}: {
  column: Column<typeof features, RowData>
  filter: ExtendedColumnFilter
  onFilterUpdate: (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => void
}): React.ReactNode {
  if (!filter.filterId) return null
  const variant = column.columnDef.meta?.variant ?? 'text'
  const operator = filter.operator ?? 'includesString'
  const disabled = operator === 'isEmpty' || operator === 'isNotEmpty'

  if (disabled) {
    return <Typography color="text.secondary">No value required</Typography>
  }

  if (variant === 'select' || variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    const multiple = variant === 'multi-select'
    const value = multiple
      ? options.filter(
          (option) =>
            Array.isArray(filter.value) && filter.value.includes(option.value),
        )
      : (options.find((option) => option.value === filter.value) ?? null)

    return (
      <Autocomplete
        size="small"
        multiple={multiple}
        options={options}
        value={value}
        getOptionLabel={(option) => option.label}
        onChange={(_, nextValue) => {
          onFilterUpdate(filter.filterId!, {
            value: Array.isArray(nextValue)
              ? nextValue.map((option) => option.value)
              : nextValue?.value,
          })
        }}
        renderInput={(params) => <TextField {...params} label="Value" />}
      />
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="From"
            type="date"
            value={toDateInputValue(value[0])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  event.target.value
                    ? new Date(event.target.value).toISOString()
                    : undefined,
                  value[1],
                ],
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            label="To"
            type="date"
            value={toDateInputValue(value[1])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  value[0],
                  event.target.value
                    ? new Date(event.target.value).toISOString()
                    : undefined,
                ],
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      )
    }

    return (
      <TextField
        size="small"
        label="Value"
        type="date"
        value={toDateInputValue(filter.value)}
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value: event.target.value
              ? new Date(event.target.value).toISOString()
              : undefined,
          })
        }
        slotProps={{ inputLabel: { shrink: true } }}
      />
    )
  }

  if (variant === 'number') {
    return (
      <TextField
        size="small"
        label="Value"
        type="number"
        value={filter.value ?? ''}
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value: event.target.value === '' ? '' : Number(event.target.value),
          })
        }
      />
    )
  }

  return (
    <TextField
      size="small"
      label="Value"
      value={filter.value ?? ''}
      onChange={(event) =>
        onFilterUpdate(filter.filterId!, { value: event.target.value })
      }
    />
  )
}

export function DataTableFilterList(): React.ReactNode {
  const table = useTableContext()
  const columnFilters = table.state.columnFilters as Array<ExtendedColumnFilter>
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const filterableColumns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table],
  )

  // Write through the raw controlled-state handler instead of
  // `table.setColumnFilters`: the table API auto-removes filters with empty
  // values, but a just-added filter row legitimately starts with `value: ''`
  // while the user is still building it.
  const setColumnFilters = (filters: Array<ExtendedColumnFilter>) => {
    table.options.onColumnFiltersChange?.(filters)
  }

  const updateFilter = (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => {
    const newFilters = columnFilters.map((filter) =>
      filter.filterId === filterId ? { ...filter, ...patch } : filter,
    )
    setColumnFilters(newFilters)
  }

  const addFilter = () => {
    if (filterableColumns.length === 0) return
    const [column] = filterableColumns
    setColumnFilters([
      ...columnFilters,
      {
        id: column.id,
        filterId: crypto.randomUUID(),
        value: '',
        operator: 'includesString',
        joinOperator: columnFilters[0]?.joinOperator ?? 'and',
      },
    ])
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<FilterListIcon />}
        endIcon={
          columnFilters.length ? (
            <Chip size="small" label={columnFilters.length} />
          ) : null
        }
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Filter
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Stack spacing={2} sx={{ width: 720, p: 2 }}>
          <Typography variant="subtitle1">Filters</Typography>
          {columnFilters.map((filter, index) => {
            const column = table.getColumn(filter.id)
            if (!column || !filter.filterId) return null
            const variant = column.columnDef.meta?.variant ?? 'text'
            const operators = getFilterOperators(variant)
            return (
              <Stack
                key={filter.filterId}
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center' }}
              >
                {index === 0 ? (
                  <Typography sx={{ width: 70 }}>Where</Typography>
                ) : index === 1 ? (
                  <FormControl size="small" sx={{ width: 90 }}>
                    <Select
                      value={filter.joinOperator ?? 'and'}
                      onChange={(event) => {
                        const joinOperator = event.target.value
                        setColumnFilters(
                          columnFilters.map((item) => ({
                            ...item,
                            joinOperator,
                          })),
                        )
                      }}
                    >
                      <MenuItem value="and">and</MenuItem>
                      <MenuItem value="or">or</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography sx={{ width: 70 }}>
                    {filter.joinOperator ?? 'and'}
                  </Typography>
                )}
                <Autocomplete
                  size="small"
                  sx={{ width: 190 }}
                  options={filterableColumns}
                  value={column}
                  getOptionLabel={(option) =>
                    option.columnDef.meta?.label ?? option.id
                  }
                  onChange={(_, nextColumn) => {
                    if (nextColumn) {
                      updateFilter(filter.filterId!, {
                        id: nextColumn.id,
                        operator: getFilterOperators(
                          nextColumn.columnDef.meta?.variant ?? 'text',
                        )[0].value,
                        value: '',
                      })
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Field" />
                  )}
                />
                <FormControl size="small" sx={{ width: 180 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    label="Operator"
                    value={filter.operator ?? operators[0].value}
                    onChange={(event) =>
                      updateFilter(filter.filterId!, {
                        operator: event.target.value,
                        value: '',
                      })
                    }
                  >
                    {operators.map((operator) => (
                      <MenuItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ flex: 1 }}>
                  <FilterValueInput
                    column={column}
                    filter={filter}
                    onFilterUpdate={updateFilter}
                  />
                </Box>
                <IconButton
                  aria-label="Remove filter"
                  onClick={() =>
                    setColumnFilters(
                      columnFilters.filter(
                        (item) => item.filterId !== filter.filterId,
                      ),
                    )
                  }
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            )
          })}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={addFilter}>
              Add filter
            </Button>
            <Button size="small" onClick={() => setColumnFilters([])}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}
