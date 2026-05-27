import { createEffect, createRoot, createSignal } from 'solid-js'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

type AnyTable = Table<TableFeatures, RowData>
type Listener = (targets: Array<TableDevtoolsRegistration>) => void

const MISSING_KEY_ERROR =
  '[TanStack Table Devtools] Missing table key. Add a `key` option to your table to use devtools.'

export interface TableDevtoolsRegistration {
  id: string
  table: AnyTable
}

export interface UpsertTableDevtoolsTargetOptions {
  table: AnyTable
}

const [registrationsMap, setRegistrationsMap] = createSignal<
  Map<string, TableDevtoolsRegistration>
>(new Map())

function getTableKey(table: AnyTable) {
  const key = table.options.key?.trim()
  return key || undefined
}

export function upsertTableDevtoolsTarget(
  options: UpsertTableDevtoolsTargetOptions,
) {
  const key = getTableKey(options.table)

  if (!key) {
    console.error(MISSING_KEY_ERROR)
    return undefined
  }

  const registrations = registrationsMap()
  const existingRegistration = registrations.get(key)

  if (existingRegistration) {
    existingRegistration.table = options.table
  } else {
    registrations.set(key, {
      id: key,
      table: options.table,
    })
  }

  setRegistrationsMap(new Map(registrations.entries()))

  return () => {
    removeTableDevtoolsTarget(key)
  }
}

export function removeTableDevtoolsTarget(id: string) {
  const registrations = registrationsMap()
  if (!registrations.delete(id)) {
    return
  }

  setRegistrationsMap(new Map(registrations.entries()))
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

export function setTableDevtoolsTarget(table: Table<any, any> | undefined) {
  if (!table) {
    return
  }

  upsertTableDevtoolsTarget({ table })
}
