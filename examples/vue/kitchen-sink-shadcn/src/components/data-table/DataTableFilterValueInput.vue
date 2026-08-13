<script setup lang="ts">
import { computed } from 'vue'
import { Calendar as CalendarIcon } from '@lucide/vue'
import { getLocalTimeZone, parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import type { ExtendedColumnFilter, FilterOperator } from '@/types'
import type { Column, RowData } from '@tanstack/vue-table'
import type { features } from '@/hooks/features'
import type { MyColumnMeta } from '@/hooks/features'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from '@/components/ui/faceted'
import { cn, formatDate } from '@/lib/utils'

const props = defineProps<{
  column: Column<typeof features, RowData>
  filter: ExtendedColumnFilter
  variant: NonNullable<MyColumnMeta['variant']>
  operator: FilterOperator
  inputId: string
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter, 'filterId'>>,
  ) => void
}>()

const columnLabel = computed(
  () => props.column.columnDef.meta?.label ?? props.column.id,
)

const columnOptions = computed(() => {
  const customOptions = props.column.columnDef.meta?.options
  if (customOptions) return customOptions

  const uniqueValues = props.column.getFacetedUniqueValues()
  return Array.from(uniqueValues.entries()).map(([value, count]) => ({
    label: String(value),
    value: String(value),
    count,
  }))
})

// Filter values are stored as ISO `YYYY-MM-DD` strings; reka-ui calendars
// speak `DateValue`, so parse/serialize at this boundary.
function toDateValue(value: unknown): DateValue | undefined {
  if (typeof value !== 'string' || value === '') return undefined
  try {
    return parseDate(value.slice(0, 10))
  } catch {
    return undefined
  }
}

function formatDateValue(value: DateValue) {
  return formatDate(value.toDate(getLocalTimeZone()), { month: 'short' })
}

const rangeValue = computed<[unknown, unknown]>(() =>
  Array.isArray(props.filter.value)
    ? [props.filter.value[0], props.filter.value[1]]
    : [props.filter.value, undefined],
)

const selectedDate = computed(() => toDateValue(props.filter.value))

const selectedDateRange = computed(() => {
  const start = toDateValue(rangeValue.value[0])
  const end = toDateValue(rangeValue.value[1])
  return start || end ? { start, end } : undefined
})

const selectedValues = computed(() =>
  Array.isArray(props.filter.value)
    ? (props.filter.value as Array<string>)
    : [],
)

function update(updates: Partial<Omit<ExtendedColumnFilter, 'filterId'>>) {
  if (props.filter.filterId) {
    props.onFilterUpdate(props.filter.filterId, updates)
  }
}

function onDatePointerDown(event: PointerEvent) {
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
  <!-- date range -->
  <div
    v-if="variant === 'date' && operator === 'inRange'"
    class="flex items-center gap-2"
  >
    <Popover>
      <PopoverTrigger as-child>
        <Button
          :id="inputId"
          :aria-controls="`${inputId}-calendar`"
          :aria-label="`${columnLabel} date range filter`"
          variant="outline"
          size="sm"
          :class="
            cn(
              'w-full justify-start text-left font-normal [&>svg]:size-3.5',
              !selectedDateRange && 'text-muted-foreground',
            )
          "
          @pointerdown="onDatePointerDown"
        >
          <CalendarIcon />
          <template v-if="selectedDateRange?.start">
            <template v-if="selectedDateRange.end">
              {{ formatDateValue(selectedDateRange.start) }} -
              {{ formatDateValue(selectedDateRange.end) }}
            </template>
            <template v-else>
              {{ formatDateValue(selectedDateRange.start) }}
            </template>
          </template>
          <span v-else>Select date range</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        :id="`${inputId}-calendar`"
        class="w-auto p-0"
        align="start"
      >
        <RangeCalendar
          :aria-label="`Select ${columnLabel} date range`"
          :model-value="{
            start: selectedDateRange?.start,
            end: selectedDateRange?.end,
          }"
          :placeholder="selectedDateRange?.start"
          :number-of-months="2"
          @update:start-value="
            (date) => update({ value: [date?.toString(), undefined], operator })
          "
          @update:model-value="
            (range) =>
              update({
                value: [range.start?.toString(), range.end?.toString()],
                operator,
              })
          "
        />
      </PopoverContent>
    </Popover>
  </div>

  <!-- single date -->
  <Popover v-else-if="variant === 'date'">
    <PopoverTrigger as-child>
      <Button
        :id="inputId"
        :aria-controls="`${inputId}-calendar`"
        :aria-label="`${columnLabel} date filter`"
        variant="outline"
        size="sm"
        :class="
          cn(
            'w-full justify-start text-left font-normal [&>svg]:size-3.5',
            !selectedDate && 'text-muted-foreground',
          )
        "
        @pointerdown="onDatePointerDown"
      >
        <CalendarIcon />
        <template v-if="selectedDate">{{
          formatDateValue(selectedDate)
        }}</template>
        <span v-else class="text-muted-foreground">Pick a date</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      :id="`${inputId}-calendar`"
      class="w-auto p-0"
      align="start"
    >
      <Calendar
        :aria-label="`Select ${columnLabel} date`"
        :model-value="selectedDate"
        :placeholder="selectedDate"
        @update:model-value="
          (date) =>
            update({ value: date ? date.toString() : undefined, operator })
        "
      />
    </PopoverContent>
  </Popover>

  <!-- number range -->
  <div
    v-else-if="variant === 'number' && operator === 'inRange'"
    class="flex items-center gap-2"
  >
    <Input
      :id="`${inputId}-min`"
      type="number"
      :aria-label="`${columnLabel} minimum value`"
      :model-value="(rangeValue[0] as string | number | undefined) ?? ''"
      placeholder="Min"
      class="h-8"
      @update:model-value="
        (value) =>
          update({
            value: [
              value === '' ? undefined : Number(value),
              (rangeValue[1] as string | number | undefined) ?? undefined,
            ],
            operator,
          })
      "
    />
    <Input
      :id="`${inputId}-max`"
      type="number"
      :aria-label="`${columnLabel} maximum value`"
      :model-value="(rangeValue[1] as string | number | undefined) ?? ''"
      placeholder="Max"
      class="h-8"
      @update:model-value="
        (value) =>
          update({
            value: [
              (rangeValue[0] as string | number | undefined) ?? undefined,
              value === '' ? undefined : Number(value),
            ],
            operator,
          })
      "
    />
  </div>

  <!-- single number -->
  <Input
    v-else-if="variant === 'number'"
    :id="inputId"
    type="number"
    :aria-label="`${columnLabel} filter value`"
    :model-value="(filter.value ?? '') as string"
    placeholder="Enter number..."
    class="h-8"
    @update:model-value="
      (value) => update({ value: value === '' ? '' : Number(value), operator })
    "
  />

  <!-- select / multi-select -->
  <Faceted
    v-else-if="variant === 'select' || variant === 'multi-select'"
    :multiple="variant === 'multi-select'"
    :model-value="
      variant === 'multi-select'
        ? selectedValues
        : typeof filter.value === 'string'
          ? filter.value
          : undefined
    "
    @update:model-value="(value) => update({ value })"
  >
    <FacetedTrigger as-child>
      <Button
        :id="inputId"
        :aria-controls="`${inputId}-listbox`"
        :aria-label="
          variant === 'multi-select'
            ? `${columnLabel} filter values`
            : `${columnLabel} filter value`
        "
        variant="outline"
        size="sm"
        class="h-8 w-full justify-start text-left font-normal"
      >
        <FacetedBadgeList
          :options="columnOptions"
          :placeholder="`Select ${columnLabel}...`"
        />
      </Button>
    </FacetedTrigger>
    <FacetedContent :id="`${inputId}-listbox`">
      <FacetedInput
        :aria-label="`Search ${columnLabel} options`"
        :placeholder="`Search ${columnLabel}...`"
      />
      <FacetedList>
        <FacetedEmpty>No options found.</FacetedEmpty>
        <FacetedGroup>
          <FacetedItem
            v-for="option in columnOptions"
            :key="option.value"
            :value="option.value"
          >
            <span>{{ option.label }}</span>
            <span
              v-if="option.count"
              class="ml-auto flex size-4 items-center justify-center font-mono text-xs"
            >
              {{ option.count }}
            </span>
          </FacetedItem>
        </FacetedGroup>
      </FacetedList>
    </FacetedContent>
  </Faceted>

  <!-- empty / not empty -->
  <div
    v-else-if="operator === 'isEmpty' || operator === 'isNotEmpty'"
    role="status"
    :id="inputId"
    aria-live="polite"
    :aria-label="`${columnLabel} filter is ${
      operator === 'isEmpty' ? 'empty' : 'not empty'
    }`"
    class="h-8 w-full rounded-md border border-dashed"
  />

  <!-- text -->
  <Input
    v-else
    :id="inputId"
    type="text"
    :aria-label="`${columnLabel} filter value`"
    :model-value="(filter.value ?? '') as string"
    :placeholder="`Search ${columnLabel}...`"
    class="h-8"
    @update:model-value="(value) => update({ value: String(value), operator })"
  />
</template>
