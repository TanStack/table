<script setup lang="ts">
import { computed } from 'vue'
import { ChevronsUpDown } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useFaceted } from '.'

const props = withDefaults(
  defineProps<{
    options?: Array<{ label: string; value: string }>
    max?: number
    badgeClassName?: string
    placeholder?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    options: () => [],
    max: 2,
    placeholder: 'Select options...',
  },
)

const context = useFaceted()

const values = computed(() =>
  Array.isArray(context.value.value)
    ? context.value.value
    : context.value.value
      ? [context.value.value]
      : [],
)

function getLabel(value: string) {
  const option = props.options.find((opt) => opt.value === value)
  return option?.label ?? value
}
</script>

<template>
  <div
    v-if="values.length === 0"
    data-slot="faceted-badge-list"
    class="flex w-full items-center gap-1 text-muted-foreground"
  >
    {{ props.placeholder }}
    <ChevronsUpDown class="ml-auto size-4 shrink-0 opacity-50" />
  </div>
  <div
    v-else
    data-slot="faceted-badge-list"
    :class="cn('flex flex-wrap items-center gap-1', props.class)"
  >
    <Badge
      v-if="values.length > props.max"
      variant="secondary"
      :class="cn('rounded-sm px-1 font-normal', props.badgeClassName)"
    >
      {{ values.length }} selected
    </Badge>
    <template v-else>
      <Badge
        v-for="value in values"
        :key="value"
        variant="secondary"
        :class="cn('rounded-sm px-1 font-normal', props.badgeClassName)"
      >
        <span class="truncate">{{ value ? getLabel(value) : '' }}</span>
      </Badge>
    </template>
  </div>
</template>
