'use client'

import * as React from 'react'
import {
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import { useEffect } from 'react'
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
  const normalizedName = normalizeName(name)

  const instanceId =
    // instanceId from react table adapter (if it exists) allows for stable devtools registration even if the table instance changes
    (table as unknown as { instanceId?: string }).instanceId ||
    `${registrationId}${normalizedName ? `-${normalizedName}` : ``}`

  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (!enabled || !table) {
      removeTableDevtoolsTarget(instanceId)
      return
    }

    upsertTableDevtoolsTarget({
      id: instanceId,
      table,
      name: normalizedName,
    })

    return () => {
      removeTableDevtoolsTarget(instanceId)
    }
    // eslint-disable-next-line @eslint-react/exhaustive-deps,react-hooks/exhaustive-deps
  }, [enabled, registrationId, instanceId])
}

export function useTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _name?: string,
  _options?: UseTanStackTableDevtoolsOptions,
): void {}
