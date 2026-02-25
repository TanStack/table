import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

type AnyTable = Table<TableFeatures, RowData>
type Listener = (table: AnyTable | undefined) => void

let currentTable: AnyTable | undefined
const listeners = new Set<Listener>()

export function setTableDevtoolsTarget(table: Table<any, any> | undefined) {
  currentTable = table
  for (const listener of listeners) {
    listener(currentTable)
  }
}

export function getTableDevtoolsTarget() {
  return currentTable
}

export function subscribeTableDevtoolsTarget(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
