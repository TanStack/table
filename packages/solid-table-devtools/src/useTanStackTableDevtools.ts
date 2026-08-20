import { createRenderEffect, onCleanup } from 'solid-js'
import { createTableDevtoolsRegistrationManager } from '@tanstack/table-devtools'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface UseTanStackTableDevtoolsOptions {
  enabled?: boolean
}

export function useTanStackTableDevtools<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  table: Table<TFeatures, TData> | undefined,
  options?: UseTanStackTableDevtoolsOptions,
): void {
  const registration = createTableDevtoolsRegistrationManager()
  onCleanup(() => registration.dispose())

  createRenderEffect(() => {
    registration.update(table, options?.enabled ?? true)
  })
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
