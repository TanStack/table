import {
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
import {
  APP_ID,
  DestroyRef,
  Injector,
  assertInInjectionContext,
  effect,
  inject,
} from '@angular/core'
import type { Table } from '@tanstack/table-core'

function normalizeName(name?: string) {
  const trimmedName = name?.trim()
  return trimmedName ? trimmedName : undefined
}

let autoId = 0
function generateId(): string {
  const appId = inject(APP_ID)
  return `tanstacktable-${appId}_${autoId++}${Date.now().toString(36)}`
}

export interface InjectTanStackTableDevtoolsOptions {
  table: Table<any, any> | undefined
  name: string
  enabled?: () => boolean
  injector?: Injector
}

export function injectTanStackTableDevtools(
  options: () => InjectTanStackTableDevtoolsOptions,
): void {
  const registrationId = generateId()
  const enabled = () => options().enabled?.() ?? true
  assertInInjectionContext(injectTanStackTableDevtools)
  const injector = options().injector ?? inject(Injector)
  const destroyRef = inject(DestroyRef)

  effect(
    (onCleanup) => {
      const { table, name } = options()
      const enabledValue = enabled()
      if (!enabledValue || !table) {
        removeTableDevtoolsTarget(registrationId)
      }
      upsertTableDevtoolsTarget({
        id: registrationId,
        table: table,
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

export function injectTanStackTableDevtoolsNoOp(
  options: () => InjectTanStackTableDevtoolsOptions,
): void {}
