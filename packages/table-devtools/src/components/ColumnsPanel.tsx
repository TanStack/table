import { For } from 'solid-js'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'

import type { Column, RowData, TableFeatures } from '@tanstack/table-core'

type AnyColumn = Column<TableFeatures, RowData, unknown>

function getColumnDefSummary(column: AnyColumn): string {
  const def = column.columnDef as Record<string, unknown>
  const header = def.header
  const accessorKey = def.accessorKey
  const accessorFn = def.accessorFn
  const parts: Array<string> = []
  if (typeof accessorKey === 'string') parts.push(`key: ${accessorKey}`)
  if (typeof accessorFn === 'function') parts.push('accessorFn')
  if (header !== undefined) {
    const headerStr =
      typeof header === 'string'
        ? header
        : typeof header === 'function'
          ? '[fn]'
          : String(header)
    parts.push(`header: ${headerStr}`)
  }
  return parts.length > 0 ? parts.join(', ') : '-'
}

export function ColumnsPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

  const tableInstance = table()
  const tableState = useTableStore(
    tableInstance ? tableInstance.store : undefined,
    (state) => state,
  )

  const getColumns = (): Array<AnyColumn> => {
    tableState?.()
    if (!tableInstance) return []

    const tableWithColumnFns = tableInstance as unknown as {
      getAllFlatColumns?: () => Array<AnyColumn>
      getAllLeafColumns?: () => Array<AnyColumn>
    }

    return (
      tableWithColumnFns.getAllFlatColumns?.() ??
      tableWithColumnFns.getAllLeafColumns?.() ??
      []
    )
  }

  const columns = getColumns()

  if (!tableInstance) {
    return (
      <div class={styles().panelScroll}>
        <div class={styles().sectionTitle}>Columns</div>
        <div class={styles().rowModelItem}>
          No table instance is connected. Pass a table instance to
          TableDevtoolsPanel.
        </div>
      </div>
    )
  }

  return (
    <div class={styles().panelScroll}>
      <div class={styles().sectionTitle}>Columns ({columns.length})</div>
      <div class={styles().tableWrapper}>
        <table class={styles().rowsTable}>
          <thead>
            <tr>
              <th class={styles().headerCell}>#</th>
              <th class={styles().headerCell}>id</th>
              <th class={styles().headerCell}>depth</th>
              <th class={styles().headerCell}>accessor</th>
              <th class={styles().headerCell}>columnDef</th>
            </tr>
          </thead>
          <tbody>
            <For each={columns}>
              {(column, index) => (
                <tr>
                  <td class={styles().bodyCellMono}>{index() + 1}</td>
                  <td class={styles().bodyCellMono}>{column.id}</td>
                  <td class={styles().bodyCellMono}>{column.depth}</td>
                  <td class={styles().bodyCellMono}>
                    {column.accessorFn ? '✓' : '○'}
                  </td>
                  <td class={styles().bodyCell}>
                    {getColumnDefSummary(column)}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  )
}
