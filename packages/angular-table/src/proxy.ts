import { computed, isSignal, type Signal, untracked } from '@angular/core'
import type { Table } from '@tanstack/table-core'

type _TableProxyAccessor<T> = T extends () => infer U ? Signal<U> : never

type _TableProxy<T extends Table<any>> = {
  [K in keyof T]: K extends `get${string}` ? _TableProxyAccessor<T[K]> : T[K]
} & {
  options: Signal<T['options']>
}

export type TableProxy<T> = Signal<Table<T>> & _TableProxy<Table<T>>

// WIP
export function proxifyTable<T>(tableSignal: Signal<Table<T>>) {
  const proxyTable = new Proxy(tableSignal, {
    get(target: Signal<Table<T>>, property: keyof Table<T>): any {
      const untypedTarget = target as any
      const table = untracked(target)

      if (!(property in table)) {
        return untypedTarget[property]
      }

      if (isSignal(untypedTarget[property])) {
        return untypedTarget[property]
      }

      // Try to transform all accessors into computed, skipping
      // handlers since they don't hold any value
      if (property.startsWith('get') && !property.endsWith('Handler')) {
        const maybeFn = table[property] as Function | never
        if (typeof maybeFn === 'function') {
          // Accessors with no arguments should be treated as computed functions
          if (maybeFn.length === 0) {
            Object.defineProperty(untypedTarget, property, {
              value: computed(() => untypedTarget()[property]()),
              configurable: true,
              enumerable: true,
            })
          }
          // Accessors with one argument could be memoized, e.g. `table.getHeaderGroups`
          if (maybeFn.length === 1) {
            Object.defineProperty(untypedTarget, property, {
              // TODO: check if this make sense
              //  Computed could run again but emitted value passes through the `memo` fn
              value: computed(() => untypedTarget()[property](), { equal: () => false }),
              configurable: true,
              enumerable: true,
            })
          }

          // Accessors with arguments could be impure functions
          if (maybeFn.length > 1) {
            Object.defineProperty(untypedTarget, property, {
              value: target()[property],
              configurable: true,
              enumerable: true,
            })
          }
        }
      }

      return table[property]
    },
  })

  return Object.assign(proxyTable, {
    options: computed(() => tableSignal().options),
  }) as TableProxy<T>
}
