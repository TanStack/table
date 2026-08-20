<script setup lang="ts">
import { computed, ref } from 'vue'
import { Popover } from '@/components/ui/popover'
import { provideFacetedContext } from '.'

const props = defineProps<{
  modelValue?: string | Array<string>
  multiple?: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: string | Array<string> | undefined]
}>()

const open = ref(false)

function onItemSelect(selectedValue: string) {
  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue) ? props.modelValue : []
    const newValue = currentValue.includes(selectedValue)
      ? currentValue.filter((v) => v !== selectedValue)
      : [...currentValue, selectedValue]
    emits('update:modelValue', newValue)
  } else {
    if (props.modelValue === selectedValue) {
      emits('update:modelValue', undefined)
    } else {
      emits('update:modelValue', selectedValue)
    }

    requestAnimationFrame(() => {
      open.value = false
    })
  }
}

provideFacetedContext({
  value: computed(() => props.modelValue),
  multiple: computed(() => props.multiple ?? false),
  onItemSelect,
})
</script>

<template>
  <Popover v-model:open="open">
    <slot />
  </Popover>
</template>
