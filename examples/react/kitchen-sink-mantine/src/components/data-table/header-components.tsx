'use client'

import * as React from 'react'
import { Box, Checkbox } from '@mantine/core'
import { Subscribe } from '@tanstack/react-table'
import { useHeaderContext, useTableContext } from '@/hooks/table'

export function SelectAllHeader(): React.ReactNode {
  const table = useTableContext()

  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            !table.getIsAllPageRowsSelected() &&
            table.getIsSomePageRowsSelected()
          }
          onChange={(event) =>
            table.toggleAllPageRowsSelected(event.currentTarget.checked)
          }
          aria-label="Select all"
        />
      )}
    </Subscribe>
  )
}

export function ResizeHandle(): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()
  const [hovered, setHovered] = React.useState(false)

  if (!header.column.getCanResize()) return null

  return (
    <Subscribe source={table.atoms.columnResizing}>
      {() => {
        const isResizing = header.column.getIsResizing()
        return (
          // Sits just inside the cell's right edge so the header's
          // `overflow: clip` (used for ellipsis) does not hide it. Idle it
          // shows a faint divider; it brightens on hover and turns the primary
          // color while actively resizing.
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
              background: isResizing
                ? 'var(--mantine-primary-color-filled)'
                : hovered
                  ? 'var(--mantine-primary-color-filled)'
                  : 'var(--mantine-color-default-border)',
              opacity: isResizing || hovered ? 1 : 0.4,
              transition: 'background 100ms, opacity 100ms',
            }}
          />
        )
      }}
    </Subscribe>
  )
}
