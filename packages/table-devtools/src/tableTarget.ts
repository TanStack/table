import { createEffect, createRoot, createSignal } from 'solid-js'
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

const [registrationsMap, setRegistrationsMap] = createSignal<
  Map<string, TableDevtoolsRegistration>
>(new Map())
let fallbackNameCounter = 1

function normalizeName(name?: string) {
  const trimmedName = name?.trim()
  return trimmedName ? trimmedName : undefined
}

export function upsertTableDevtoolsTarget(
  options: UpsertTableDevtoolsTargetOptions,
) {
  const registrations = registrationsMap()
  const existingRegistration = registrations.get(options.id)
  const name = normalizeName(options.name)

  if (existingRegistration) {
    existingRegistration.table = options.table
    existingRegistration.name = name
  } else {
    registrations.set(options.id, {
      id: options.id,
      table: options.table,
      name,
      fallbackName: `Table ${fallbackNameCounter++}`,
    })
  }

  setRegistrationsMap(new Map(registrations.entries()))
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
    removeTableDevtoolsTarget(LEGACY_TARGET_ID)
    return
  }

  upsertTableDevtoolsTarget({
    id: LEGACY_TARGET_ID,
    table,
  })
}
