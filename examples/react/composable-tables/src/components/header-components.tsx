/**
 * Header-level components that use useHeaderContext
 *
 * These components can be used via the pre-bound headerComponents
 * in AppHeader children, e.g., <header.SortIndicator />
 */
import { useHeaderContext } from '../hooks/table'

/**
 * Sort indicator showing current sort direction
 */
export function SortIndicator() {
  const header = useHeaderContext()
  const sorted = header.column.getIsSorted()

  if (!sorted) return null

  return (
    <span className="sort-indicator">{sorted === 'asc' ? '🔼' : '🔽'}</span>
  )
}

/**
 * Column filter input
 */
export function ColumnFilter() {
  const header = useHeaderContext()

  if (!header.column.getCanFilter()) return null

  const columnFilterValue = header.column.getFilterValue()

  return (
    <div className="column-filter" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(e) => header.column.setFilterValue(e.target.value)}
        placeholder={`Filter ${header.column.id}...`}
      />
    </div>
  )
}

/**
 * Footer showing the column ID
 */
export function FooterColumnId() {
  const header = useHeaderContext()
  return <span className="footer-column-id">{header.column.id}</span>
}

/**
 * Footer showing a summary/aggregation for numeric columns
 */
export function FooterSum() {
  const header = useHeaderContext()
  const table = header.getContext().table
  const rows = table.getFilteredRowModel().rows

  // Calculate sum for numeric columns
  const sum = rows.reduce((acc, row) => {
    const value = row.getValue(header.column.id)
    return acc + (typeof value === 'number' ? value : 0)
  }, 0)

  return (
    <span className="footer-sum">{sum > 0 ? sum.toLocaleString() : '—'}</span>
  )
}
