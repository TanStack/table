import { createRenderEffect, onCleanup } from 'solid-js'
import { upsertTableDevtoolsTarget } from '@tanstack/table-devtools'
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
  createRenderEffect(() => {
    if (!(options?.enabled ?? true) || !table) {
      return
    }

    const cleanup = upsertTableDevtoolsTarget({ table })

    onCleanup(() => {
      cleanup?.()
    })
  })
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
