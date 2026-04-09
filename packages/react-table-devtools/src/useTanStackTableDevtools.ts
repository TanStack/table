'use client'

import * as React from 'react'
import {
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface UseTanStackTableDevtoolsOptions {
  enabled?: boolean
}

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
  const registrationId = React.useId()
  const enabled = options?.enabled ?? true

  React.useEffect(() => {
    if (!enabled || !table) {
      removeTableDevtoolsTarget(registrationId)
      return
    }

    upsertTableDevtoolsTarget({
      id: registrationId,
      table,
      name: normalizeName(name),
    })

    return () => {
      removeTableDevtoolsTarget(registrationId)
    }
  }, [enabled, name, registrationId, table])
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _name?: string,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
