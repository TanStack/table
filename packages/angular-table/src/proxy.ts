import { computed, type Signal, untracked } from '@angular/core'
import { type Table } from '@tanstack/table-core'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type TableProxyAccessor<T> = T extends (...args: any[]) => any
  ? T
  : T extends () => infer U
    ? Signal<U>
    : never

type TableProxy<T extends Table<any>> = Prettify<
  {
    [K in keyof T]: K extends `get${string}` ? TableProxyAccessor<T[K]> : T[K]
  } & {
    options: Signal<T['options']>
  }
>

export type TableResult<T> = Signal<Table<T>> & TableProxy<Table<T>>

// WIP
export function proxifyTable<T>(tableSignal: Signal<Table<T>>): TableResult<T> {
  const proxyTable = new Proxy(tableSignal, {
    get(target: Signal<Table<T>>, property: keyof Table<T>): any {
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
          // TODO: need to check better this, since there are some fns that have an optional argument.
          //  This may work also for fns with more than 1 argument.
          if (maybeFn.length === 1) {
            const computedCache: Record<string, Signal<unknown>> = {}
            const computedTrap = new Proxy(maybeFn, {
              apply(target: any, thisArg: any, argArray: any[]): any {
                const args = JSON.stringify(argArray)
                if (computedCache[args]) {
                  return computedCache[args]?.()
                }
                const computedSignal = computed(() => {
                  untypedTarget()[property]()
                  return Reflect.apply(target, thisArg, argArray)
                })
                computedCache[args] = computedSignal
                return computedSignal()
              },
            })
            Object.defineProperty(untypedTarget, property, {
              value: computedTrap,
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
  }) as TableResult<T>
}
