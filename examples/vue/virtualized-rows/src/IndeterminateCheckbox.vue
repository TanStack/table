<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  checked?: boolean
  disabled?: boolean
  indeterminate: boolean
  className?: string
  onChange?: (event: Event) => void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = !props.checked && !!props.indeterminate
  }
})
</script>

<template>
  <input
    type="checkbox"
    ref="inputRef"
    :class="`${props.className ?? ''} sortable-header`"
    :checked="props.checked"
    :disabled="props.disabled"
    @change="props.onChange"
    v-bind="$attrs"
  />
</template>
