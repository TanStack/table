/**
 * Cell-level components that use useCellContext
 *
 * These components can be used via the pre-bound cellComponents
 * in AppCell children, e.g., <cell.TextCell />
 */
import { Subscribe } from '@tanstack/preact-table'
import { useCellContext, useTableContext } from '../hooks/table'
import { IndeterminateCheckbox } from './indeterminate-checkbox'

/**
 * Row-selection checkbox cell - toggles selection for the current row.
 *
 * The `Subscribe` boundary keeps the checkbox in sync with the row-selection
 * state. It reads `row.getIsSelected()` (a table API call, not a reactive prop
 * or hook), so subscribing to the selection state ensures it re-renders when
 * selection changes without depending on a parent re-render.
 */
export function SelectCell() {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      )}
    </Subscribe>
  )
}

/**
 * Generic text cell renderer
 */
export function TextCell() {
  const cell = useCellContext<string>()
  return <span>{cell.getValue()}</span>
}

/**
 * Number cell with locale formatting
 */
export function NumberCell() {
  const cell = useCellContext<number>()
  return <span>{cell.getValue().toLocaleString()}</span>
}

/**
 * Status badge cell for status column
 */
export function StatusCell() {
  const cell = useCellContext<'relationship' | 'complicated' | 'single'>()
  const status = cell.getValue()
  return <span className={`status-badge ${status}`}>{status}</span>
}

/**
 * Progress bar cell
 */
export function ProgressCell() {
  const cell = useCellContext<number>()
  const progress = cell.getValue()
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

/**
 * Row actions cell - actions for the current row
 */
export function RowActionsCell() {
  const cell = useCellContext()
  const row = cell.row

  return (
    <div className="row-actions">
      <button
        onClick={() =>
          alert(`View: ${row.original.firstName} ${row.original.lastName}`)
        }
        title="View"
      >
        👁️
      </button>
      <button
        onClick={() =>
          alert(`Edit: ${row.original.firstName} ${row.original.lastName}`)
        }
        title="Edit"
      >
        ✏️
      </button>
      <button
        onClick={() =>
          alert(`Delete: ${row.original.firstName} ${row.original.lastName}`)
        }
        title="Delete"
      >
        🗑️
      </button>
    </div>
  )
}

/**
 * Price cell with currency formatting
 */
export function PriceCell() {
  const cell = useCellContext<number>()
  return (
    <span className="price">
      $
      {cell.getValue().toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  )
}

/**
 * Category badge cell
 */
export function CategoryCell() {
  const cell = useCellContext<'electronics' | 'clothing' | 'food' | 'books'>()
  const category = cell.getValue()
  return <span className={`category-badge ${category}`}>{category}</span>
}
