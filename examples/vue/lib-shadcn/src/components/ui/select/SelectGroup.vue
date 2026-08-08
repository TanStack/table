<script setup lang="ts">
import { SelectGroup } from 'reka-ui'
import type { SelectGroupProps } from 'reka-ui'

const props = defineProps<SelectGroupProps>()
</script>

<template>
  <SelectGroup data-slot="select-group" v-bind="props">
    <slot />
  </SelectGroup>
</template>
