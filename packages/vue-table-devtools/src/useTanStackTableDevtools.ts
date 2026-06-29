import { unref, watchEffect } from 'vue'
import { upsertTableDevtoolsTarget } from '@tanstack/table-devtools'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'
import type { MaybeRef } from 'vue'

export interface UseTanStackTableDevtoolsOptions {
  enabled?: boolean
}

export function useTanStackTableDevtools<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  table: MaybeRef<Table<TFeatures, TData> | undefined>,
  options?: MaybeRef<UseTanStackTableDevtoolsOptions | undefined>,
): void {
  watchEffect((onCleanup) => {
    const resolvedOptions = unref(options)
    const resolvedTable = unref(table)

    if (!(resolvedOptions?.enabled ?? true) || !resolvedTable) {
      return
    }

    const cleanup = upsertTableDevtoolsTarget({ table: resolvedTable })

    onCleanup(() => {
      cleanup?.()
    })
  })
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: MaybeRef<Table<TFeatures, TData> | undefined>,
  _options?: MaybeRef<UseTanStackTableDevtoolsOptions | undefined>,
): void {}
