<script lang="ts" setup>
import { computed } from 'vue'
import DebouncedInput from './DebouncedInput.vue'
import type { MyColumnMeta, Person, appFeatures } from './tableHelper'
import type { PropType } from 'vue'
import type { Column } from '@tanstack/vue-table'

const props = defineProps({
  column: {
    type: Object as PropType<Column<typeof appFeatures, Person>>,
    required: true,
  },
})

const filterVariant = computed<MyColumnMeta['filterVariant']>(
  () => props.column.columnDef.meta?.filterVariant,
)

const columnFilterValue = computed(() => props.column.getFilterValue())

// dynamically generated options / autocomplete values from the faceting feature
const sortedUniqueValues = computed(() =>
  filterVariant.value === 'range'
    ? []
    : Array.from(props.column.getFacetedUniqueValues().keys())
        .sort()
        .slice(0, 5000),
)
</script>

<template>
  <div v-if="filterVariant === 'range'">
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
          column.getFacetedMinMaxValues()?.[0] !== undefined
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

  <select
    v-else-if="filterVariant === 'select'"
    :value="columnFilterValue?.toString()"
    @change="
      (e) => column.setFilterValue((e.target as HTMLSelectElement).value)
    "
  >
    <option value="">All</option>
    <option v-for="value in sortedUniqueValues" :key="value" :value="value">
      {{ value }}
    </option>
  </select>

  <div v-else>
    <datalist :id="column.id + 'list'">
      <option v-for="value in sortedUniqueValues" :key="value" :value="value" />
    </datalist>
    <DebouncedInput
      type="text"
      :modelValue="(columnFilterValue ?? '') as string"
      @update:modelValue="(value) => column.setFilterValue(value)"
      :placeholder="`Search... (${column.getFacetedUniqueValues().size})`"
      class="filter-select"
      :list="column.id + 'list'"
    />
    <div class="spacer-xs" />
  </div>
</template>
