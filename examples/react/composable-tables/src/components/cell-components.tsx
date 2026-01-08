/**
 * Cell-level components that use useCellContext
 *
 * These components can be used via the pre-bound cellComponents
 * in AppCell children, e.g., <cell.TextCell />
 */
import { useCellContext } from '../hooks/table'

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
