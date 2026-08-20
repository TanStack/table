import {
  createTableDevtoolsRegistrationManager,
  seedDevtoolsFontStyle,
} from '@tanstack/table-devtools'
import {
  DestroyRef,
  Injector,
  assertInInjectionContext,
  effect,
  inject,
  untracked,
} from '@angular/core'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

seedDevtoolsFontStyle()

export interface InjectTanStackTableDevtoolsOptions<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> {
  table: Table<TFeatures, TData> | undefined
  enabled?: () => boolean
  injector?: unknown
}

export function injectTanStackTableDevtools<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(options: () => InjectTanStackTableDevtoolsOptions<TFeatures, TData>): void {
  const enabled = () => options().enabled?.() ?? true
  const initialOptions = options()
  let injector = initialOptions.injector as Injector | undefined

  if (!injector) {
    assertInInjectionContext(injectTanStackTableDevtools)
    injector = inject(Injector)
  }

  const destroyRef = injector.get(DestroyRef)
  const registration = createTableDevtoolsRegistrationManager()
  destroyRef.onDestroy(() => registration.dispose())

  effect(
    () => {
      const { table } = options()
      const enabledValue = enabled()
      untracked(() => registration.update(table, enabledValue))
    },
    { injector },
  )
}

export function injectTanStackTableDevtoolsNoOp<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
>(_options: () => InjectTanStackTableDevtoolsOptions<TFeatures, TData>): void {}
