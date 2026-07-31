'use client'

import { useEffect } from 'preact/hooks'
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
  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (!enabled || !table) {
      return
    }

    const cleanup = upsertTableDevtoolsTarget({ table })

    return () => {
      cleanup?.()
    }
  }, [enabled, table, table?.options.key])
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
