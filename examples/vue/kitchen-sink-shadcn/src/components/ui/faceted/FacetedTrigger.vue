<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps<{
  asChild?: boolean
  class?: HTMLAttributes['class']
}>()

function onPointerDown(event: PointerEvent) {
  // Prevent implicit pointer capture so the popover input stays focusable.
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId)
  }

  if (
    event.button === 0 &&
    event.ctrlKey === false &&
    event.pointerType === 'mouse' &&
    !(event.target instanceof HTMLInputElement)
  ) {
    event.preventDefault()
  }
}
</script>

<template>
  <PopoverTrigger
    data-slot="faceted-trigger"
    :as-child="props.asChild"
    :class="
      cn(
        'justify-between text-left focus:outline-none focus:ring-1 focus:ring-ring',
        props.class,
      )
    "
    @pointerdown="onPointerDown"
  >
    <slot />
  </PopoverTrigger>
</template>
