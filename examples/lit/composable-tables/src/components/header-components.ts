import { html, nothing } from 'lit'
import type { Header } from '@tanstack/lit-table'

// Header components are plain functions that receive the header instance as
// their first argument (bound automatically by AppHeader/AppFooter in createTableHook).
// In column definitions, call them as: header.SortIndicator()

export function SortIndicator(header: Header<any, any, any>) {
  const sorted = header.column.getIsSorted()
  if (!sorted) return nothing
  return html`<span class="sort-indicator"
    >${sorted === 'asc' ? '🔼' : '🔽'}</span
  >`
}

export function ColumnFilter(header: Header<any, any, any>) {
  if (!header.column.getCanFilter()) return nothing
  const value = (header.column.getFilterValue() ?? '') as string
  return html`
    <div class="column-filter" @click=${(e: Event) => e.stopPropagation()}>
      <input
        type="text"
        .value=${value}
        @input=${(e: InputEvent) =>
          header.column.setFilterValue((e.target as HTMLInputElement).value)}
        placeholder="Filter ${header.column.id}..."
      />
    </div>
  `
}

export function FooterColumnId(header: Header<any, any, any>) {
  return html`<span>${header.column.id}</span>`
}

export function FooterSum(header: Header<any, any, any>) {
  const table = header.getContext().table
  const rows = table.getFilteredRowModel().rows
  const sum = rows.reduce((acc, row) => {
    const value = row.getValue(header.column.id)
    return acc + (typeof value === 'number' ? value : 0)
  }, 0)
  return html`<span>${sum > 0 ? sum.toLocaleString() : '—'}</span>`
}
