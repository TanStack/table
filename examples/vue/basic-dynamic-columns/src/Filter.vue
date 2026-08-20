<script lang="ts" setup>
import { computed } from 'vue'
import DebouncedInput from './DebouncedInput.vue'
import type { DynamicRow, features } from './tableHelper'
import type { PropType } from 'vue'
import type { Column, Table } from '@tanstack/vue-table'

// A different filter UI per data type. All reactive reads (getFilterValue, the
// faceted values) go through Vue `computed()` so they stay fresh as the column
// filter / faceting state changes. Vue needs no Subscribe workaround here.
const props = defineProps({
  column: {
    type: Object as PropType<Column<typeof features, DynamicRow, unknown>>,
    required: true,
  },
  table: {
    type: Object as PropType<Table<typeof features, DynamicRow>>,
    required: true,
  },
})

const dataType = computed(
  () => props.column.columnDef.meta?.dataType ?? 'string',
)

const filterValue = computed(() => props.column.getFilterValue())

// number: faceted min/max used for the placeholder hints
const facetedMinMax = computed(
  () => props.column.getFacetedMinMaxValues() ?? [],
)

// string: low-cardinality columns become a select of their faceted values,
// everything else gets a free-text search.
const uniqueValues = computed(() =>
  Array.from(props.column.getFacetedUniqueValues().keys()).map(String).sort(),
)
const isEnum = computed(
  () => uniqueValues.value.length > 0 && uniqueValues.value.length <= 10,
)
const facetedUniqueSize = computed(
  () => props.column.getFacetedUniqueValues().size,
)
</script>

<template>
  <!-- number: two range inputs with faceted min/max placeholders -->
  <div v-if="dataType === 'number'" class="filter-row">
    <DebouncedInput
      type="number"
      :modelValue="(filterValue as [number, number] | undefined)?.[0] ?? ''"
      @update:modelValue="
        (value) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            value,
            old?.[1],
          ])
      "
      :placeholder="`Min${
        facetedMinMax[0] !== undefined ? ` (${facetedMinMax[0]})` : ''
      }`"
      class="filter-input"
    />
    <DebouncedInput
      type="number"
      :modelValue="(filterValue as [number, number] | undefined)?.[1] ?? ''"
      @update:modelValue="
        (value) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            old?.[0],
            value,
          ])
      "
      :placeholder="`Max${
        facetedMinMax[1] !== undefined ? ` (${facetedMinMax[1]})` : ''
      }`"
      class="filter-input"
    />
  </div>

  <!-- date: two date inputs -->
  <div v-else-if="dataType === 'date'" class="filter-row">
    <DebouncedInput
      type="date"
      :modelValue="(filterValue as [string, string] | undefined)?.[0] ?? ''"
      @update:modelValue="
        (value) =>
          column.setFilterValue((old: [string, string] | undefined) => [
            String(value),
            old?.[1] ?? '',
          ])
      "
      class="filter-input"
    />
    <DebouncedInput
      type="date"
      :modelValue="(filterValue as [string, string] | undefined)?.[1] ?? ''"
      @update:modelValue="
        (value) =>
          column.setFilterValue((old: [string, string] | undefined) => [
            old?.[0] ?? '',
            String(value),
          ])
      "
      class="filter-input"
    />
  </div>

  <!-- boolean: All / Yes / No select -->
  <select
    v-else-if="dataType === 'boolean'"
    class="filter-select"
    :value="(filterValue ?? '').toString()"
    @change="
      (e) => column.setFilterValue((e.target as HTMLSelectElement).value)
    "
  >
    <option value="">All</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>

  <!-- string (low cardinality): enum select of faceted values -->
  <select
    v-else-if="isEnum"
    class="filter-select"
    :value="(filterValue ?? '').toString()"
    @change="
      (e) => column.setFilterValue((e.target as HTMLSelectElement).value)
    "
  >
    <option value="">All</option>
    <option v-for="value in uniqueValues" :key="value" :value="value">
      {{ value }}
    </option>
  </select>

  <!-- string (high cardinality): debounced free-text search -->
  <DebouncedInput
    v-else
    type="text"
    :modelValue="(filterValue ?? '') as string"
    @update:modelValue="(value) => column.setFilterValue(value)"
    :placeholder="`Search... (${facetedUniqueSize})`"
    class="filter-input"
  />
</template>
