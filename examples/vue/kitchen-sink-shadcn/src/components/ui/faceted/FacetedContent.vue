<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PopoverContent } from '@/components/ui/popover'
import { Command } from '@/components/ui/command'
import { cn } from '@/lib/utils'

const props = defineProps<{
  id?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <PopoverContent
    :id="props.id"
    data-slot="faceted-content"
    align="start"
    :class="
      cn(
        'w-[200px] origin-(--reka-popover-content-transform-origin) p-0',
        props.class,
      )
    "
  >
    <Command>
      <slot />
    </Command>
  </PopoverContent>
</template>
