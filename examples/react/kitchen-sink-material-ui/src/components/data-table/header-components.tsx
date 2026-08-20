import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
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
          onChange={(_, checked) => table.toggleAllPageRowsSelected(checked)}
          slotProps={{ input: { 'aria-label': 'Select all' } }}
          size="small"
        />
      )}
    </Subscribe>
  )
}

export function ResizeHandle(): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()

  if (!header.column.getCanResize()) return null

  return (
    <Subscribe source={table.atoms.columnResizing}>
      {() => (
        <Box
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          sx={{
            position: 'absolute',
            top: 0,
            right: -6,
            width: 6,
            height: '100%',
            cursor: 'col-resize',
            touchAction: 'none',
            bgcolor: header.column.getIsResizing()
              ? 'primary.main'
              : 'transparent',
            '&:hover': { bgcolor: 'primary.main' },
          }}
        />
      )}
    </Subscribe>
  )
}
