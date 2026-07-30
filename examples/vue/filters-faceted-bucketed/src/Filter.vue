<script lang="ts" setup>
import { computed } from 'vue'
import type {
  Account,
  FacetOption,
  MyColumnMeta,
  appFeatures,
} from './tableHelper'
import type { PropType } from 'vue'
import type { Column } from '@tanstack/vue-table'

const props = defineProps({
  column: {
    type: Object as PropType<Column<typeof appFeatures, Account>>,
    required: true,
  },
})

const filterVariant = computed<MyColumnMeta['filterVariant']>(
  () => props.column.columnDef.meta?.filterVariant,
)

const columnFilterValue = computed(() => props.column.getFilterValue())

const facetOptions = computed(
  () => props.column.columnDef.meta?.facetOptions ?? [],
)
const selected = computed(
  () => (columnFilterValue.value ?? []) as Array<string>,
)
const counts = computed(() => props.column.getFacetedUniqueValues())

function toggleFacet(value: string) {
  props.column.setFilterValue(
    selected.value.includes(value)
      ? selected.value.filter((selectedValue) => selectedValue !== value)
      : [...selected.value, value],
  )
}
</script>

<template>
  <fieldset v-if="filterVariant === 'facets'" class="facet-options">
    <label
      v-for="option in facetOptions as ReadonlyArray<FacetOption>"
      :key="option.value"
    >
      <input
        type="checkbox"
        :checked="selected.includes(option.value)"
        @change="toggleFacet(option.value)"
      />
      <span>{{ option.label }}</span>
      <span class="count">{{
        (counts.get(option.value) ?? 0).toLocaleString()
      }}</span>
    </label>
  </fieldset>
  <div v-else>
    <input
      type="text"
      :value="(columnFilterValue ?? '') as string"
      @input="
        (event) =>
          column.setFilterValue((event.target as HTMLInputElement).value)
      "
      placeholder="Search…"
      class="filter-select"
    />
  </div>
</template>
