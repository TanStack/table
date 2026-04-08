import { html } from 'lit'
import type { Cell } from '@tanstack/lit-table'

// Cell components are plain functions that receive the cell instance as their
// first argument (bound automatically by AppCell in createTableHook).
// In column definitions, call them as: cell: ({ cell }) => cell.TextCell()

export function TextCell(cell: Cell<any, any, string>) {
  return html`<span>${String(cell.getValue() ?? '')}</span>`
}

export function NumberCell(cell: Cell<any, any, number>) {
  return html`<span>${Number(cell.getValue() ?? 0).toLocaleString()}</span>`
}

export function StatusCell(cell: Cell<any, any, string>) {
  const status = String(cell.getValue() ?? '')
  const statusClass =
    status === 'single'
      ? 'single'
      : status === 'complicated'
        ? 'complicated'
        : 'relationship'
  return html`<span class="status-badge ${statusClass}">${status}</span>`
}

export function ProgressCell(cell: Cell<any, any, number>) {
  const value = Number(cell.getValue() ?? 0)
  return html`
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: ${value}%"></div>
    </div>
  `
}

export function RowActionsCell(cell: Cell<any, any, any>) {
  const row = cell.row.original as {
    firstName?: string
    name?: string
  }
  const name = row.firstName ?? row.name ?? 'row'
  return html`
    <div class="row-actions">
      <button @click=${() => alert(`View ${name}`)}>View</button>
      <button @click=${() => alert(`Edit ${name}`)}>Edit</button>
      <button @click=${() => alert(`Delete ${name}`)}>Delete</button>
    </div>
  `
}

export function PriceCell(cell: Cell<any, any, number>) {
  const value = Number(cell.getValue() ?? 0)
  return html`<span class="price"
    >$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</span
  >`
}

export function CategoryCell(cell: Cell<any, any, string>) {
  const category = String(cell.getValue() ?? '')
  return html`<span class="category-badge ${category}">${category}</span>`
}
