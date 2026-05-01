<script lang="ts" setup>
import { computed } from 'vue'
import DebouncedInput from './DebouncedInput.vue'
import type { Person, appFeatures } from './tableHelper'
import type { PropType } from 'vue'
import type { Column, Table } from '@tanstack/vue-table'

const props = defineProps({
  column: {
    type: Object as PropType<Column<typeof appFeatures, Person>>,
    required: true,
  },
  table: {
    type: Object as PropType<Table<typeof appFeatures, Person>>,
    required: true,
  },
})

const firstValue = computed(() =>
  props.table.getPreFilteredRowModel().flatRows[0]?.getValue(props.column.id),
)

const columnFilterValue = computed(() => props.column.getFilterValue())
const sortedUniqueValues = computed(() =>
  typeof firstValue.value === 'number'
    ? []
    : Array.from(props.column.getFacetedUniqueValues().keys()).sort(),
)
</script>

<template>
  <div v-if="typeof firstValue === 'number'">
    <div class="filter-row">
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :modelValue="(columnFilterValue as [number, number])?.[0] ?? ''"
        @update:modelValue="
          (value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        "
        :placeholder="`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
        }`"
        class="filter-input"
      />
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :modelValue="(columnFilterValue as [number, number])?.[1] ?? ''"
        @update:modelValue="
          (value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
        "
        :placeholder="`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
        }`"
        class="filter-input"
      />
    </div>
    <div class="spacer-xs" />
  </div>
  <div v-else>
    <datalist :id="column.id + 'list'">
      <option
        v-for="value in sortedUniqueValues.slice(0, 5000)"
        :key="value"
        :value="value"
      />
    </datalist>
    <DebouncedInput
      type="text"
      :modelValue="(columnFilterValue ?? '') as string"
      @update:modelValue="(value) => column.setFilterValue(value)"
      :placeholder="`Search... (${
        column.getFacetedUniqueValues() instanceof Map
          ? column.getFacetedUniqueValues().size
          : 0
      })`"
      class="filter-select"
      :list="column.id + 'list'"
    />
    <div class="spacer-xs" />
  </div>
</template>
