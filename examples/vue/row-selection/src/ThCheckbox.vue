<template>
  <input
    class="form-check-input"
    type="checkbox"
    :checked="table.getIsAllRowsSelected()"
    :indeterminate="table.getIsSomeRowsSelected()"
    @change="table.getToggleAllRowsSelectedHandler()($event)"
  >
</template>

<script setup lang="ts">
import {
  type Table,
} from '@tanstack/table-core/src/types';

const props = defineProps<{
  table: Table<unknown>
}>();
</script>
