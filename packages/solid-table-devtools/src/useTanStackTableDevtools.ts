import { createRenderEffect, onCleanup } from 'solid-js'
import {
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface UseTanStackTableDevtoolsOptions {
  enabled?: boolean
}

let nextRegistrationId = 0

function normalizeName(name?: string) {
  const trimmedName = name?.trim()
  return trimmedName ? trimmedName : undefined
}

export function useTanStackTableDevtools<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  table: Table<TFeatures, TData> | undefined,
  name?: string,
  options?: UseTanStackTableDevtoolsOptions,
): void {
  const registrationId = `solid-table-devtools-${++nextRegistrationId}`

  createRenderEffect(() => {
    if (!(options?.enabled ?? true) || !table) {
      removeTableDevtoolsTarget(registrationId)
      return
    }

    upsertTableDevtoolsTarget({
      id: registrationId,
      table,
      name: normalizeName(name),
    })

    onCleanup(() => {
      removeTableDevtoolsTarget(registrationId)
    })
  })
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _name?: string,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
