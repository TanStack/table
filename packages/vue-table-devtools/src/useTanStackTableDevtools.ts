import { onScopeDispose, unref, watchEffect } from 'vue'
import { createTableDevtoolsRegistrationManager } from '@tanstack/table-devtools'
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
  const registration = createTableDevtoolsRegistrationManager()
  onScopeDispose(() => registration.dispose())

  watchEffect(() => {
    const resolvedOptions = unref(options)
    const resolvedTable = unref(table)

    registration.update(resolvedTable, resolvedOptions?.enabled ?? true)
  })
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: MaybeRef<Table<TFeatures, TData> | undefined>,
  _options?: MaybeRef<UseTanStackTableDevtoolsOptions | undefined>,
): void {}
