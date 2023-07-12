<script lang="ts" setup>
import { ref, computed, PropType, watchEffect } from 'vue'

import type { Column, Table } from '@tanstack/vue-table'

import DebouncedInput from './DebouncedInput.vue'

const props = defineProps({
  column: {
    type: Object as PropType<Column<any, unknown>>,
    required: true,
  },
  table: {
    type: Object as PropType<Table<any>>,
    required: true,
  },
})

const firstValue = computed(() =>
  props.table.getPreFilteredRowModel().flatRows[0]?.getValue(props.column.id)
)

// if the column is ever numeric, it should stay that way to prevent it
// switching type when the result set is empty
const isNumericFilter = ref(false)
watchEffect(() => {
  if (typeof firstValue.value === 'number') {
    isNumericFilter.value = true
  }
})

const columnFilterValue = computed(() => props.column.getFilterValue())
</script>

<template>
  <div v-if="isNumericFilter">
    <div class="flex space-x-2">
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :modelValue="(columnFilterValue as [number, number])?.[0] ?? ''"
        @update:modelValue="value => column.setFilterValue((old: [number, number]) => [value, old?.[1]])"
        placeholder="Min"
        class="w-24 border shadow rounded"
      />
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :modelValue="(columnFilterValue as [number, number])?.[1] ?? ''"
        @update:modelValue="value => column.setFilterValue((old: [number, number]) => [old?.[0], value])"
        placeholder="Max"
        class="w-24 border shadow rounded"
      />
    </div>
    <div class="h-1" />
  </div>
  <div v-else>
    <DebouncedInput
      type="text"
      :modelValue="(columnFilterValue ?? '') as string"
      @update:modelValue="value => column.setFilterValue(value)"
      placeholder="Search..."
      class="w-36 border shadow rounded"
    />
    <div class="h-1" />
  </div>
</template>
