import { getCurrentInstance, unref, watchEffect } from 'vue'
import {
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { MaybeRef } from 'vue'

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
  table: MaybeRef<Table<TFeatures, TData> | undefined>,
  name?: MaybeRef<string | undefined>,
  options?: MaybeRef<UseTanStackTableDevtoolsOptions | undefined>,
): void {
  const instance = getCurrentInstance()
  const registrationId = instance
    ? `vue-table-devtools-${instance.uid}`
    : `vue-table-devtools-${++nextRegistrationId}`

  watchEffect((onCleanup) => {
    const resolvedOptions = unref(options)
    const resolvedTable = unref(table)

    if (!(resolvedOptions?.enabled ?? true) || !resolvedTable) {
      removeTableDevtoolsTarget(registrationId)
      return
    }

    upsertTableDevtoolsTarget({
      id: registrationId,
      table: resolvedTable,
      name: normalizeName(unref(name)),
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
  _table: MaybeRef<Table<TFeatures, TData> | undefined>,
  _name?: MaybeRef<string | undefined>,
  _options?: MaybeRef<UseTanStackTableDevtoolsOptions | undefined>,
): void {}
