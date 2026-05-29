import { upsertTableDevtoolsTarget } from '@tanstack/table-devtools'
import {
  Injector,
  assertInInjectionContext,
  effect,
  inject,
  untracked,
} from '@angular/core'
import type { Table } from '@tanstack/table-core'

export interface InjectTanStackTableDevtoolsOptions {
  table: Table<any, any> | undefined
  enabled?: () => boolean
  injector?: Injector
}

export function injectTanStackTableDevtools(
  options: () => InjectTanStackTableDevtoolsOptions,
): void {
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

export function injectTanStackTableDevtoolsNoOp(
  _options: () => InjectTanStackTableDevtoolsOptions,
): void {}
