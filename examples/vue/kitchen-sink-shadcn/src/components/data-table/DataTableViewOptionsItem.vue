<script setup lang="ts">
import { Check, GripVertical } from '@lucide/vue'
import { useSortable } from 'dnd-kit-vue'
import type { Column, RowData } from '@tanstack/vue-table'
import type { features } from '@/hooks/features'

import { Button } from '@/components/ui/button'
import { CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'

const props = defineProps<{
  column: Column<typeof features, RowData>
  index: number
}>()

const { elementRef, handleRef, isDragging } = useSortable(() => ({
  id: props.column.id,
  index: props.index,
}))
</script>

<template>
  <CommandItem
    :ref="elementRef"
    :value="props.column.id"
    :aria-selected="props.column.getIsVisible()"
    :data-selected="props.column.getIsVisible()"
    :data-dragging="isDragging"
    class="data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
    @select="props.column.toggleVisibility(!props.column.getIsVisible())"
  >
    <Check
      :class="
        cn(
          'size-4 shrink-0',
          props.column.getIsVisible() ? 'opacity-100' : 'opacity-0',
        )
      "
    />
    <span class="truncate">
      {{ props.column.columnDef.meta?.label ?? props.column.id }}
    </span>
    <Button :ref="handleRef" variant="ghost" size="icon" class="ml-auto size-6">
      <GripVertical />
    </Button>
  </CommandItem>
</template>
