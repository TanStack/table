'use client'

import { createTableDevtoolsRegistrationManager } from '@tanstack/table-devtools'
import { useEffect, useState } from 'react'
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
  const [registration] = useState(createTableDevtoolsRegistrationManager)

  useEffect(() => {
    return () => registration.dispose()
  }, [registration])

  useEffect(() => {
    registration.update(table, enabled)
  }, [enabled, registration, table, table?.options.key])
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
