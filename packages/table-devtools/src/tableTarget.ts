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

interface TableDevtoolsRegistrationEntry {
  registration: TableDevtoolsRegistration
  leases: Set<symbol>
}

export interface UpsertTableDevtoolsTargetOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  table: Table<TFeatures, TData>
}

export interface TableDevtoolsRegistrationManager {
  update: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> | undefined,
    enabled?: boolean,
  ) => void
  dispose: () => void
}

const [registrationsMap, setRegistrationsMap] = createSignal<
  Map<string, TableDevtoolsRegistrationEntry>
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
  const existingEntry = registrations.get(key)
  const lease = Symbol(key)

  if (existingEntry) {
    if (
      existingEntry.registration.table === table ||
      existingEntry.registration.table.store === table.store
    ) {
      if (existingEntry.registration.table !== table) {
        Object.assign(existingEntry.registration.table, table)
      }
      existingEntry.leases.add(lease)
      return () => {
        releaseTableDevtoolsTarget(key, lease)
      }
    }

    const nextRegistrations = new Map(registrations)
    nextRegistrations.set(key, {
      registration: {
        id: key,
        table,
      },
      leases: new Set([lease]),
    })
    setRegistrationsMap(nextRegistrations)
  } else {
    const nextRegistrations = new Map(registrations)
    nextRegistrations.set(key, {
      registration: {
        id: key,
        table,
      },
      leases: new Set([lease]),
    })
    setRegistrationsMap(nextRegistrations)
  }

  return () => {
    releaseTableDevtoolsTarget(key, lease)
  }
}

function releaseTableDevtoolsTarget(id: string, lease: symbol) {
  const registrations = untrack(registrationsMap)
  const entry = registrations.get(id)
  if (!entry?.leases.delete(lease) || entry.leases.size > 0) {
    return
  }

  const nextRegistrations = new Map(registrations)
  nextRegistrations.delete(id)
  setRegistrationsMap(nextRegistrations)
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
  return Array.from(registrationsMap().values(), (entry) => entry.registration)
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

export function createTableDevtoolsRegistrationManager(): TableDevtoolsRegistrationManager {
  let cleanup: (() => void) | undefined

  return {
    update: (table, enabled = true) => {
      if (!enabled || !table) {
        cleanup?.()
        cleanup = undefined
        return
      }

      const previousCleanup = cleanup
      cleanup = upsertTableDevtoolsTarget({ table })
      previousCleanup?.()
    },
    dispose: () => {
      cleanup?.()
      cleanup = undefined
    },
  }
}
