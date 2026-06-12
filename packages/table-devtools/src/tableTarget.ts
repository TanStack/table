import { createEffect, createRoot, createSignal, untrack } from 'solid-js'
import type { Readable } from '@tanstack/solid-store'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

type Listener = (targets: Array<TableDevtoolsRegistration>) => void

const MISSING_KEY_ERROR =
  '[TanStack Table Devtools] Missing table key. Add a `key` option to your table to use devtools.'

export interface TableDevtoolsStore<TState = unknown> extends Readable<TState> {
  state: TState
}

export interface TableDevtoolsTable {
  _features: Record<string, unknown>
  _rowModelFns: unknown
  baseAtoms: Record<string, unknown>
  initialState: unknown
  options: {
    atoms?: Record<string, unknown>
    data?: unknown
    features?: Record<string, unknown>
    key?: string
    state?: Record<string, unknown>
    [key: string]: unknown
  }
  optionsStore?: TableDevtoolsStore
  reset: () => void
  store: TableDevtoolsStore
}

export interface TableDevtoolsRegistration {
  id: string
  table: TableDevtoolsTable
}

export interface UpsertTableDevtoolsTargetOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TFeatures, TData>
}

const [registrationsMap, setRegistrationsMap] = createSignal<
  Map<string, TableDevtoolsRegistration>
>(new Map())

function getTableKey(table: TableDevtoolsTable) {
  const key = untrack(() => table.options.key?.trim())
  return key || undefined
}

export function upsertTableDevtoolsTarget<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: UpsertTableDevtoolsTargetOptions<TFeatures, TData>) {
  const table = options.table as unknown as TableDevtoolsTable
  const key = getTableKey(table)

  if (!key) {
    console.error(MISSING_KEY_ERROR)
    return undefined
  }

  const registrations = untrack(registrationsMap)
  const existingRegistration = registrations.get(key)

  if (existingRegistration) {
    if (existingRegistration.table === table) {
      return () => {
        removeTableDevtoolsTarget(key)
      }
    }

    const nextRegistrations = new Map(registrations)
    nextRegistrations.set(key, {
      id: key,
      table,
    })
    setRegistrationsMap(nextRegistrations)
  } else {
    const nextRegistrations = new Map(registrations)
    nextRegistrations.set(key, {
      id: key,
      table,
    })
    setRegistrationsMap(nextRegistrations)
  }

  return () => {
    removeTableDevtoolsTarget(key)
  }
}

export function removeTableDevtoolsTarget(id: string) {
  const registrations = untrack(registrationsMap)
  if (!registrations.has(id)) {
    return
  }

  const nextRegistrations = new Map(registrations)
  nextRegistrations.delete(id)

  setRegistrationsMap(nextRegistrations)
}

export function getTableDevtoolsTargets(): Array<TableDevtoolsRegistration> {
  return Array.from(registrationsMap().values())
}

export function subscribeTableDevtoolsTargets(listener: Listener) {
  let disposeRoot = () => {}
  createRoot((dispose) => {
    disposeRoot = dispose
    createEffect(() => {
      listener(getTableDevtoolsTargets())
    })
  })
  return disposeRoot
}

export function setTableDevtoolsTarget<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData> | undefined) {
  if (!table) {
    return
  }

  upsertTableDevtoolsTarget({ table })
}
