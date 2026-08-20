'use client'

import * as React from 'react'
import { Box } from '@chakra-ui/react'
import { useHeaderContext, useTableContext } from '@/hooks/table'
import { CheckboxField } from '@/components/data-table/shared'

export function SelectAllHeader(): React.ReactNode {
  const table = useTableContext()

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => (
        <CheckboxField
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            !table.getIsAllPageRowsSelected() &&
            table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(checked)
          }
          aria-label="Select all"
        />
      )}
    </table.Subscribe>
  )
}

export function ResizeHandle(): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()
  const [hovered, setHovered] = React.useState(false)

  if (!header.column.getCanResize()) return null

  return (
    <table.Subscribe source={table.atoms.columnResizing}>
      {() => {
        const isResizing = header.column.getIsResizing()
        return (
          // Sits just inside the cell's right edge so it isn't hidden behind
          // the neighbouring column. Idle it shows a faint divider; it
          // brightens on hover and turns solid while actively resizing.
          <Box
            onDoubleClick={() => header.column.resetSize()}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 5,
              height: '100%',
              cursor: 'col-resize',
              userSelect: 'none',
              touchAction: 'none',
              background:
                isResizing || hovered
                  ? 'var(--chakra-colors-blue-solid)'
                  : 'var(--chakra-colors-border)',
              opacity: isResizing || hovered ? 1 : 0.4,
              transition: 'background 100ms, opacity 100ms',
            }}
          />
        )
      }}
    </table.Subscribe>
  )
}
