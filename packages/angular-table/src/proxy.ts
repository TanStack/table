import { computed, isSignal, type Signal, untracked } from '@angular/core'
import type { Table } from '@tanstack/table-core'

type TableProxyAccessor<T> = T extends () => infer U ? Signal<U> : never

type _TableProxy<T extends Table<any>> = {
  [K in keyof T]: K extends `get${string}` ? TableProxyAccessor<T[K]> : T[K]
} & {
  options: Signal<T['options']>
}

export type TableProxy<T> = Signal<Table<T>> & _TableProxy<Table<T>>

// WIP
export function proxifyTable<T>(tableSignal: Signal<Table<T>>) {
  const propertyCache: Record<string, any> = {}

  const proxyTable = new Proxy(tableSignal, {
    get(target: Signal<Table<T>>, property: keyof Table<T>): any {
      if (propertyCache[property]) {
        return propertyCache[property]
      }
      const untypedTarget = target as any
      if (untypedTarget[property]) {
        return untypedTarget[property]
      }

      const table = untracked(target)
      if (!(property in table)) {
        return untypedTarget[property]
      }

      // Attempt to convert all accessors into computed ones,
      // excluding handlers as they do not retain any value.
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

          // Accessors with one argument could be a memoized fn (e.g. `getHeaderGroups(memoArgs)`)
          // or a fn with some dependent parameter in their signature (e.g. `getIsSomeRowsPinned(position)`)
          // TODO: need to check better this, since there are some fns that have an optional argument
          if (maybeFn.length === 1) {
            let computedSignal: Signal<unknown> | undefined
            const maybeComputedTrap = new Proxy(maybeFn, {
              apply(target: any, thisArg: any, argArray: any[]): any {
                if (argArray.length === 0) {
                  if (computedSignal) {
                    return computedSignal()
                  }
                  computedSignal = computed(() => untypedTarget()[property]())
                  // We don't need the proxy anymore, so we'll override the cache value
                  // in order to use the existing signal in the next change detection cycle
                  propertyCache[property] = computedSignal
                  return computedSignal()
                }
                return Reflect.apply(target, thisArg, argArray)
              },
            })

            propertyCache[property] = maybeComputedTrap

            Object.defineProperty(untypedTarget, property, {
              value: maybeComputedTrap,
              configurable: true,
              enumerable: true,
            })
          }

          // Accessors with arguments could be impure functions, so we can't memoize the value
          if (maybeFn.length > 1) {
            Object.defineProperty(untypedTarget, property, {
              value: target()[property],
              configurable: true,
              enumerable: true,
            })
          }
        }
      }

      return untypedTarget[property] || table[property]
    },
  })

  return Object.assign(proxyTable, {
    options: computed(() => tableSignal().options),
  }) as TableProxy<T>
}
