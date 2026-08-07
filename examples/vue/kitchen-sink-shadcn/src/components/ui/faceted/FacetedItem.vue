<script setup lang="ts">
import { computed } from 'vue'
import { Check } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useFaceted } from '.'

const props = defineProps<{
  value: string
  class?: HTMLAttributes['class']
}>()

const context = useFaceted()

const isSelected = computed(() =>
  context.multiple.value
    ? Array.isArray(context.value.value) &&
      context.value.value.includes(props.value)
    : context.value.value === props.value,
)
</script>

<template>
  <CommandItem
    data-slot="faceted-item"
    :aria-selected="isSelected"
    :data-selected="isSelected"
    :value="props.value"
    :class="cn('gap-2', props.class)"
    @select="context.onItemSelect(props.value)"
  >
    <span
      :class="
        cn(
          'flex size-4 items-center justify-center rounded-sm border border-primary',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'opacity-50 [&_svg]:invisible',
        )
      "
    >
      <Check class="size-4" />
    </span>
    <slot />
  </CommandItem>
</template>
