import { useHeaderContext, useTableContext } from '@/hooks/table'
import { SelectionCheckbox, cx } from '@/components/data-table/shared'

export function SelectAllHeader(): React.ReactNode {
  const table = useTableContext()

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => (
        <SelectionCheckbox
          ariaLabel="Select all"
          isSelected={table.getIsAllPageRowsSelected()}
          isIndeterminate={
            !table.getIsAllPageRowsSelected() &&
            table.getIsSomePageRowsSelected()
          }
          onChange={(selected) => table.toggleAllPageRowsSelected(selected)}
        />
      )}
    </table.Subscribe>
  )
}

export function ResizeHandle(): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()

  if (!header.column.getCanResize()) return null

  return (
    <table.Subscribe source={table.atoms.columnResizing}>
      {() => (
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={cx(
            'column-resizer',
            header.column.getIsResizing() && 'bg-primary',
          )}
        />
      )}
    </table.Subscribe>
  )
}
