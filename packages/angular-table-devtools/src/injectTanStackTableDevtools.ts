import {
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import {
  APP_ID,
  DestroyRef,
  Injectable,
  Injector,
  assertInInjectionContext,
  effect,
  inject,
} from '@angular/core'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface InjectTanStackTableDevtoolsOptions {
  enabled?: () => boolean
  injector?: Injector
}

function normalizeName(name?: string) {
  const trimmedName = name?.trim()
  return trimmedName ? trimmedName : undefined
}

let autoId = 0
function generateId(): string {
  const appId = inject(APP_ID)
  return `tanstacktable-${appId}_${autoId++}${Date.now().toString(36)}`
}

export function injectTanStackTableDevtools<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  table: () => Table<TFeatures, TData> | undefined,
  name?: string,
  options?: InjectTanStackTableDevtoolsOptions,
): void {
  const registrationId = generateId()
  const enabled = () => options?.enabled?.() ?? true
  assertInInjectionContext(injectTanStackTableDevtools)
  const injector = options?.injector ?? inject(Injector)
  const destroyRef = inject(DestroyRef)

  effect(
    (onCleanup) => {
      const enabledValue = enabled()
      const tableValue = table()
      if (!enabledValue || !tableValue) {
        removeTableDevtoolsTarget(registrationId)
      }
      upsertTableDevtoolsTarget({
        id: registrationId,
        table: tableValue,
        name: normalizeName(name),
      })
      onCleanup(() => {
        removeTableDevtoolsTarget(registrationId)
      })
    },
    { injector },
  )

  destroyRef.onDestroy(() => {
    removeTableDevtoolsTarget(registrationId)
  })
}

export function injectTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(
  _table: Table<TFeatures, TData> | undefined,
  _name?: string,
  _options?: InjectTanStackTableDevtoolsOptions,
): void {}
