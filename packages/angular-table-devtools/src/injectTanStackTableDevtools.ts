import { upsertTableDevtoolsTarget } from '@tanstack/table-devtools'
import {
  Injector,
  assertInInjectionContext,
  effect,
  inject,
  untracked,
} from '@angular/core'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export interface InjectTanStackTableDevtoolsOptions<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> {
  table: Table<TFeatures, TData> | undefined
  enabled?: () => boolean
  injector?: Injector
}

export function injectTanStackTableDevtools<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(options: () => InjectTanStackTableDevtoolsOptions<TFeatures, TData>): void {
  const enabled = () => options().enabled?.() ?? true
  assertInInjectionContext(injectTanStackTableDevtools)
  const injector = options().injector ?? inject(Injector)

  effect(
    (onCleanup) => {
      const { table } = options()
      const enabledValue = enabled()
      if (!enabledValue || !table) {
        return
      }
      const cleanup = untracked(() => upsertTableDevtoolsTarget({ table }))
      onCleanup(() => {
        cleanup?.()
      })
    },
    { injector },
  )
}

export function injectTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(_options: () => InjectTanStackTableDevtoolsOptions<TFeatures, TData>): void {}
