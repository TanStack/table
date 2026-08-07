<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronsUpDown, ListFilter, Trash2 } from '@lucide/vue'
import { useId } from 'reka-ui'
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from '@/types'
import type { Column, RowData } from '@tanstack/vue-table'
import type { features } from '@/hooks/features'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { getFilterOperators } from '@/lib/data-table'
import { cn } from '@/lib/utils'
import { useTableContext } from '@/hooks/table'
import DataTableFilterValueInput from '@/components/data-table/DataTableFilterValueInput.vue'

const table = useTableContext()
const columnFilters = computed(
  () => table.atoms.columnFilters.get() as Array<ExtendedColumnFilter>,
)

// Write through the raw controlled-state handler instead of
// `table.setColumnFilters`: the table API auto-removes filters with empty
// values, but a just-added filter row legitimately starts with `value: ''`
// while the user is still building it.
const setColumnFilters = (filters: Array<ExtendedColumnFilter>) => {
  table.options.onColumnFiltersChange?.(filters)
}

const id = useId()
const labelId = useId()
const descriptionId = useId()
const listId = useId()
const open = ref(false)

const filterableColumns = computed(() =>
  table.getAllColumns().filter((column) => column.getCanFilter()),
)

function getColumnFilterVariant(column: Column<typeof features, RowData>) {
  if (column.columnDef.meta?.variant) {
    return column.columnDef.meta.variant
  }

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  if (Array.isArray(firstValue)) return 'multi-select'
  if (typeof firstValue === 'number') return 'number'
  if (firstValue instanceof Date) return 'date'

  return 'text'
}

function onFilterAddImpl(columnId: string): ExtendedColumnFilter | null {
  const column = filterableColumns.value.find((col) => col.id === columnId)
  if (!column) return null

  const filterVariant = getColumnFilterVariant(column)
  const operators = getFilterOperators(filterVariant)
  const defaultOperator = operators[0].value

  return {
    id: columnId,
    value: filterVariant === 'multi-select' ? [] : '',
    operator: defaultOperator,
    filterId: crypto.randomUUID(),
    joinOperator: 'and',
  }
}

function onFilterAdd() {
  const firstFilterableColumn = filterableColumns.value[0]

  const newFilter = onFilterAddImpl(firstFilterableColumn.id)
  if (newFilter) {
    setColumnFilters([...columnFilters.value, newFilter])
  }
}

function onFilterUpdate(
  filterId: string,
  updates: Partial<Omit<ExtendedColumnFilter, 'filterId'>>,
) {
  const newFilters = columnFilters.value.map((filter) => {
    if (filter.filterId === filterId) {
      if (updates.id) {
        const newColumn = filterableColumns.value.find(
          (col) => col.id === updates.id,
        )
        if (newColumn) {
          const filterVariant = getColumnFilterVariant(newColumn)
          const operators = getFilterOperators(filterVariant)
          const defaultOperator = operators[0].value
          return {
            ...filter,
            ...updates,
            operator: defaultOperator,
            value: filterVariant === 'multi-select' ? [] : '',
          }
        }
      }

      if (updates.operator && filter.value) {
        const column = filterableColumns.value.find(
          (col) => col.id === filter.id,
        )
        if (column && getColumnFilterVariant(column) === 'date') {
          const currentValue = filter.value
          if (updates.operator === 'inRange' && !Array.isArray(currentValue)) {
            return {
              ...filter,
              ...updates,
              value: [currentValue, undefined],
            }
          } else if (
            updates.operator !== 'inRange' &&
            Array.isArray(currentValue)
          ) {
            return {
              ...filter,
              ...updates,
              value: currentValue[0] ?? '',
            }
          }
        }
      }

      return { ...filter, ...updates }
    }
    return filter
  })
  setColumnFilters(newFilters)
}

function onFilterRemove(filterId: string) {
  setColumnFilters(
    columnFilters.value.filter((filter) => filter.filterId !== filterId),
  )
}

function onJoinOperatorChange(value: JoinOperator) {
  if (columnFilters.value.length > 0) {
    setColumnFilters(
      columnFilters.value.map((f) => ({ ...f, joinOperator: value })),
    )
  }
}

function getFilterColumn(filter: ExtendedColumnFilter) {
  return table.getColumn(filter.id)
}

function onTriggerPointerDown(event: PointerEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId)
  }

  if (
    event.button === 0 &&
    event.ctrlKey === false &&
    event.pointerType === 'mouse'
  ) {
    event.preventDefault()
  }
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="[&_svg]:size-3"
        @click="($event.currentTarget as HTMLElement).focus()"
        @pointerdown="onTriggerPointerDown"
      >
        <ListFilter />
        Filter
        <Badge
          v-if="columnFilters.length > 0"
          variant="secondary"
          class="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
        >
          {{ columnFilters.length }}
        </Badge>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      :aria-describedby="descriptionId"
      :aria-labelledby="labelId"
      align="start"
      :collision-padding="16"
      class="flex flex-col gap-3 origin-(--reka-popover-content-transform-origin) p-4 w-[calc(100vw-theme(spacing.12))] min-w-60 sm:min-w-80 sm:w-fit sm:max-w-none"
    >
      <div class="flex flex-col gap-1">
        <h4 :id="labelId" class="font-medium leading-none">Filters</h4>
        <p
          :id="descriptionId"
          :class="
            cn(
              'text-sm text-muted-foreground',
              columnFilters.length > 0 && 'sr-only',
            )
          "
        >
          {{
            columnFilters.length > 0
              ? 'Modify filters to refine your results.'
              : 'Add filters to refine your results.'
          }}
        </p>
      </div>
      <div
        v-if="columnFilters.length > 0"
        role="list"
        :id="listId"
        class="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-0.5"
      >
        <template v-for="(filter, index) in columnFilters" :key="filter.filterId">
          <div
            v-if="getFilterColumn(filter) && filter.filterId"
            role="listitem"
            :id="`${id}-filter-${filter.filterId}`"
            class="grid items-center grid-cols-[70px_135px_125px_minmax(0,200px)_32px] gap-2"
          >
            <span
              v-if="index === 0"
              class="text-sm text-center text-muted-foreground"
            >
              Where
            </span>
            <Select
              v-else-if="index === 1"
              :model-value="filter.joinOperator"
              @update:model-value="
                (value) => onJoinOperatorChange(value as JoinOperator)
              "
            >
              <SelectTrigger
                class="h-8"
                aria-label="Select join operator"
                :aria-controls="`${id}-filter-${filter.filterId}-join-operator-listbox`"
              >
                <SelectValue placeholder="Join" />
              </SelectTrigger>
              <SelectContent
                :id="`${id}-filter-${filter.filterId}-join-operator-listbox`"
                class="min-w-(--reka-select-trigger-width)"
              >
                <SelectItem value="and">and</SelectItem>
                <SelectItem value="or">or</SelectItem>
              </SelectContent>
            </Select>
            <span v-else class="text-sm text-center text-muted-foreground">
              {{ filter.joinOperator }}
            </span>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  role="combobox"
                  :id="`${id}-filter-${filter.filterId}-trigger`"
                  :aria-controls="`${id}-filter-${filter.filterId}-field-listbox`"
                  :aria-label="`Select filter field. Current: ${getFilterColumn(filter)!.columnDef.meta?.label ?? filter.id}`"
                  variant="outline"
                  size="sm"
                  class="h-8 justify-between font-normal focus:outline-none focus:ring-1 focus:ring-ring"
                  @pointerdown="onTriggerPointerDown"
                >
                  <span class="truncate">
                    {{
                      getFilterColumn(filter)!.columnDef.meta?.label ??
                      filter.id
                    }}
                  </span>
                  <ChevronsUpDown class="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                :id="`${id}-filter-${filter.filterId}-field-listbox`"
                class="w-(--reka-popover-trigger-width) p-0"
              >
                <Command>
                  <CommandInput
                    placeholder="Search columns..."
                    aria-label="Search filterable columns"
                  />
                  <CommandList>
                    <CommandEmpty>No column found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        v-for="col in filterableColumns"
                        :key="col.id"
                        :value="col.id"
                        @select="onFilterUpdate(filter.filterId!, { id: col.id })"
                      >
                        <span class="truncate">
                          {{ col.columnDef.meta?.label ?? col.id }}
                        </span>
                        <Check
                          :class="
                            cn(
                              'ml-auto size-4',
                              col.id === filter.id
                                ? 'opacity-100'
                                : 'opacity-0',
                            )
                          "
                          aria-hidden="true"
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Select
              :model-value="filter.operator ?? 'includesString'"
              @update:model-value="
                (value) =>
                  onFilterUpdate(filter.filterId!, {
                    operator: value as FilterOperator,
                  })
              "
            >
              <SelectTrigger
                class="h-8"
                aria-label="Select filter operator"
                :aria-controls="`${id}-filter-${filter.filterId}-operator-listbox`"
              >
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent
                :id="`${id}-filter-${filter.filterId}-operator-listbox`"
              >
                <SelectItem
                  v-for="op in getFilterOperators(
                    getColumnFilterVariant(getFilterColumn(filter)!),
                  )"
                  :key="op.value"
                  :value="op.value"
                >
                  {{ op.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <DataTableFilterValueInput
              :column="getFilterColumn(filter)!"
              :filter="filter"
              :variant="getColumnFilterVariant(getFilterColumn(filter)!)"
              :operator="filter.operator ?? 'includesString'"
              :input-id="`${id}-filter-${filter.filterId}-input`"
              :on-filter-update="onFilterUpdate"
            />
            <Button
              variant="outline"
              size="icon"
              class="size-8 [&_svg]:size-3.5"
              :aria-label="`Remove ${getFilterColumn(filter)!.columnDef.meta?.label ?? filter.id} filter`"
              @click="onFilterRemove(filter.filterId!)"
            >
              <Trash2 />
            </Button>
          </div>
        </template>
      </div>
      <div class="flex items-center gap-2">
        <Button size="sm" aria-label="Add new filter" @click="onFilterAdd">
          Add filter
        </Button>
        <Button
          v-if="columnFilters.length > 0"
          aria-label="Reset all filters"
          variant="outline"
          size="sm"
          @click="setColumnFilters([])"
        >
          Reset filters
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
