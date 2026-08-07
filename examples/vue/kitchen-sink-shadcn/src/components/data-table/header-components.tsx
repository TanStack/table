import { defineComponent } from 'vue'
import type { Component } from 'vue'
import { useHeaderContext, useTableContext } from '@/hooks/table'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export const SelectAllHeader: Component = defineComponent({
  name: 'SelectAllHeader',
  setup() {
    const table = useTableContext()

    return () => {
      void table.atoms.rowSelection.get()
      return (
        <Checkbox
          modelValue={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          {...{
            'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
              table.toggleAllPageRowsSelected(!!value),
          }}
          aria-label="Select all"
          class="translate-y-0.5"
        />
      )
    }
  },
})

export const ResizeHandle: Component = defineComponent({
  name: 'ResizeHandle',
  setup() {
    const header = useHeaderContext()
    const table = useTableContext()

    return () => {
      if (!header.column.getCanResize()) return null
      void table.atoms.columnResizing.get()
      return (
        <div
          onDblclick={() => header.column.resetSize()}
          onMousedown={header.getResizeHandler()}
          onTouchstart={header.getResizeHandler()}
          class={cn(
            'absolute right-[-2px] z-10 top-1/2 h-6 w-[3px] -translate-y-1/2 cursor-e-resize select-none touch-none rounded-md transition-colors hover:bg-blue-600 before:absolute before:left-[-4px] before:right-[-4px] before:top-0 before:h-full before:content-[""]',
            header.column.getIsResizing() && 'bg-blue-600',
          )}
        />
      )
    }
  },
})
