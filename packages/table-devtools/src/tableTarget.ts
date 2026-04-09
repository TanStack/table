import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

type AnyTable = Table<TableFeatures, RowData>
type Listener = (targets: Array<TableDevtoolsRegistration>) => void

const LEGACY_TARGET_ID = '__legacy__'

export interface TableDevtoolsRegistration {
  id: string
  table: AnyTable
  name?: string
  fallbackName: string
}

export interface UpsertTableDevtoolsTargetOptions {
  id: string
  table: AnyTable
  name?: string
}

const registrations = new Map<string, TableDevtoolsRegistration>()
const listeners = new Set<Listener>()
let fallbackNameCounter = 1

function emitTargets() {
  const targets = getTableDevtoolsTargets()

  for (const listener of listeners) {
    listener(targets)
  }
}

function normalizeName(name?: string) {
  const trimmedName = name?.trim()
  return trimmedName ? trimmedName : undefined
}

export function upsertTableDevtoolsTarget(
  options: UpsertTableDevtoolsTargetOptions,
) {
  const existingRegistration = registrations.get(options.id)
  const name = normalizeName(options.name)

  if (existingRegistration) {
    registrations.set(options.id, {
      ...existingRegistration,
      table: options.table,
      name,
    })
  } else {
    registrations.set(options.id, {
      id: options.id,
      table: options.table,
      name,
      fallbackName: `Table ${fallbackNameCounter++}`,
    })
  }

  emitTargets()
}

export function removeTableDevtoolsTarget(id: string) {
  if (!registrations.delete(id)) {
    return
  }

  emitTargets()
}

export function getTableDevtoolsTargets(): Array<TableDevtoolsRegistration> {
  return Array.from(registrations.values())
}

export function subscribeTableDevtoolsTargets(listener: Listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function setTableDevtoolsTarget(table: Table<any, any> | undefined) {
  if (!table) {
    removeTableDevtoolsTarget(LEGACY_TARGET_ID)
    return
  }

  upsertTableDevtoolsTarget({
    id: LEGACY_TARGET_ID,
    table,
  })
}
