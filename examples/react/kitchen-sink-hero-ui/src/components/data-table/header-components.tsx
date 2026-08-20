'use client'

import { Checkbox, cn } from '@heroui/react'
import { useHeaderContext, useTableContext } from '@/hooks/table'

export function SelectAllHeader(): React.ReactNode {
  const table = useTableContext()

  return (
    <table.Subscribe selector={(s) => s.rowSelection}>
      {() => (
        <Checkbox
          slot={null}
          isSelected={table.getIsAllPageRowsSelected()}
          isIndeterminate={
            !table.getIsAllPageRowsSelected() &&
            table.getIsSomePageRowsSelected()
          }
          onChange={(selected: boolean) =>
            table.toggleAllPageRowsSelected(selected)
          }
          aria-label="Select all"
        >
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox.Content>
        </Checkbox>
      )}
    </table.Subscribe>
  )
}

export function ResizeHandle(): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()

  if (!header.column.getCanResize()) return null

  return (
    <table.Subscribe selector={(s) => s.columnSizing}>
      {() => (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cn(
            'absolute right-[-6px] top-0 h-full w-1.5 cursor-col-resize touch-none',
            header.column.getIsResizing() && 'bg-primary',
          )}
        />
      )}
    </table.Subscribe>
  )
}
