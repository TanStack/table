<template>
  <input
    class="form-check-input"
    type="checkbox"
    :checked="row.getIsSelected()"
    :disabled="!row.getCanSelect()"
    :indeterminate="row.getIsSomeSelected()"
    :value="row.id"
    @change="row.getToggleSelectedHandler()($event)"
  >
</template>

<script setup lang="ts">
import {
  type Row
} from '@tanstack/table-core';

const props = defineProps<{
  row: Row<unknown>;
}>();
</script>
