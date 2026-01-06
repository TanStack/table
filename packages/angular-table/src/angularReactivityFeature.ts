import { computed, isSignal, signal } from '@angular/core'
import {
  defineLazyComputedProperty,
  markReactive,
  toComputed,
} from './reactivityUtils'
import type { Signal } from '@angular/core'
import type {
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface TableOptions_Plugins<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > extends TableOptions_AngularReactivity {}

  interface Table_Plugins<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > extends Table_AngularReactivity<TFeatures, TData> {}
}

type SkipPropertyFn = (property: string) => boolean

export interface AngularReactivityFlags {
  header: boolean | SkipPropertyFn
  column: boolean | SkipPropertyFn
  row: boolean | SkipPropertyFn
  cell: boolean | SkipPropertyFn
  table: boolean | SkipPropertyFn
}

interface TableOptions_AngularReactivity {
  enableExperimentalReactivity?: boolean
  reactivity?: Partial<AngularReactivityFlags>
}

interface Table_AngularReactivity<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  get: Signal<Table<TFeatures, TData>>
  /**
   * @internal
   */
  setTableNotifier: (signal: Signal<Table<TFeatures, TData>>) => void
}

interface AngularReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  TableOptions: TableOptions_AngularReactivity
  Table: Table_AngularReactivity<TFeatures, TData>
}

const getUserSkipPropertyFn = (
  value: undefined | null | boolean | SkipPropertyFn,
  defaultPropertyFn: SkipPropertyFn,
) => {
  if (typeof value === 'boolean') {
    return defaultPropertyFn
  }
  return value ?? defaultPropertyFn
}

export function constructAngularReactivityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<AngularReactivityFeatureConstructors<TFeatures, TData>> {
  return {
    getDefaultTableOptions(table) {
      return {
        reactivity: {
          header: true,
          column: true,
          row: true,
          cell: true,
          table: true,
        },
      }
    },
    constructTableAPIs: (table) => {
      const rootNotifier = signal<Signal<any> | null>(null)
      table.setTableNotifier = (notifier) => rootNotifier.set(notifier)
      table.get = computed(() => rootNotifier()!(), { equal: () => false })
      markReactive(table)
      setReactiveProps(table.get, table, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.table,
          skipBaseProperties,
        ),
      })
    },

    assignCellPrototype: (prototype, table) => {
      // if (cell._table.options.reactivity?.cell === false) {
      //   return
      // }
      // markReactive(cell)
      // setReactiveProps(cell._table.get, cell, {
      //   skipProperty: getUserSkipPropertyFn(
      //     cell._table.options.reactivity?.cell,
      //     skipBaseProperties,
      //   ),
      // })
      if (!table.options.enableExperimentalReactivity) {
        return
      }
      // Store reference to table for runtime access
      ;(prototype as any).__angularTable = table
      setReactivePropsOnPrototype(prototype, {
        skipProperty: skipBaseProperties,
      })
    },

    assignColumnPrototype: (prototype, table) => {
      // if (column._table.options.reactivity?.column === false) {
      //   return
      // }
      // markReactive(column)
      // setReactiveProps(column._table.get, column, {
      //   skipProperty: getUserSkipPropertyFn(
      //     column._table.options.reactivity?.cell,
      //     skipBaseProperties,
      //   ),
      // })
      if (!table.options.enableExperimentalReactivity) {
        return
      }
      // Store reference to table for runtime access
      ;(prototype as any).__angularTable = table
      setReactivePropsOnPrototype(prototype, {
        skipProperty: skipBaseProperties,
      })
    },

    assignHeaderPrototype: (prototype, table) => {
      // if (header._table.options.reactivity?.header === false) {
      //   return
      // }
      // markReactive(header)
      // setReactiveProps(header._table.get, header, {
      //   skipProperty: getUserSkipPropertyFn(
      //     header._table.options.reactivity?.cell,
      //     skipBaseProperties,
      //   ),
      // })
      if (!table.options.enableExperimentalReactivity) {
        return
      }
      // Store reference to table for runtime access
      ;(prototype as any).__angularTable = table
      setReactivePropsOnPrototype(prototype, {
        skipProperty: skipBaseProperties,
      })
    },

    assignRowPrototype: (prototype, table) => {
      // if (row._table.options.reactivity?.row === false) {
      //   return
      // }
      // markReactive(row)
      // setReactiveProps(row._table.get, row, {
      //   skipProperty: getUserSkipPropertyFn(
      //     row._table.options.reactivity?.cell,
      //     skipBaseProperties,
      //   ),
      // })
      if (!table.options.enableExperimentalReactivity) {
        return
      }
      // Store reference to table for runtime access
      ;(prototype as any).__angularTable = table
      setReactivePropsOnPrototype(prototype, {
        skipProperty: skipBaseProperties,
      })
    },
  }
}

export const angularReactivityFeature = constructAngularReactivityFeature()

function skipBaseProperties(property: string): boolean {
  return (
    // equals `getContext`
    property === 'getContext' ||
    // start with `_`
    property[0] === '_' ||
    // doesn't start with `get`, but faster
    !(property[0] === 'g' && property[1] === 'e' && property[2] === 't') ||
    // ends with `Handler`
    property.endsWith('Handler')
  )
}

function setReactiveProps(
  notifier: Signal<Table<any, any>>,
  obj: { [key: string]: any },
  options: {
    bindTo?: unknown
    skipProperty: (property: string) => boolean
  },
) {
  const { skipProperty } = options
  for (const property in obj) {
    let value = obj[property]
    if (
      isSignal(value) ||
      typeof value !== 'function' ||
      skipProperty(property)
    ) {
      continue
    }

    if (options.bindTo && 'bind' in value) {
      value = value.bind(options.bindTo)
    }

    defineLazyComputedProperty(notifier, {
      valueFn: value,
      property,
      originalObject: obj,
    })
  }
}

function setReactivePropsOnPrototype(
  prototype: Record<string, any>,
  options: {
    skipProperty: (property: string) => boolean
  },
) {
  const { skipProperty } = options

  // Wrap methods on the prototype that will be lazily wrapped at instance access time
  // We intercept property access on the prototype to wrap methods when they're first accessed
  const propertyNames = Object.getOwnPropertyNames(prototype)
  for (const property of propertyNames) {
    if (property === 'table' || property.startsWith('__angular')) {
      continue
    }
    const descriptor = Object.getOwnPropertyDescriptor(prototype, property)
    if (descriptor && typeof descriptor.value === 'function') {
      if (skipProperty(property)) {
        continue
      }
      // Store original method
      const originalMethod = descriptor.value
      // Replace with a function that will be wrapped at instance creation time
      Object.defineProperty(prototype, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        value: function (this: any, ...args: Array<any>) {
          // Get the table from the instance
          const table = this.table
          if (table && table._rootNotifier) {
            // Check if already wrapped on this instance
            const instanceDescriptor = Object.getOwnPropertyDescriptor(
              this,
              property,
            )
            if (
              instanceDescriptor &&
              instanceDescriptor.value?.__angularWrapped
            ) {
              return instanceDescriptor.value.apply(this, args)
            }
            // Wrap the method with toComputed using the table's rootNotifier
            // Create a wrapper function that calls the original method
            const boundMethod = originalMethod.bind(this)
            const wrapped = toComputed(
              table._rootNotifier,
              boundMethod,
              property,
            )
            wrapped.__angularWrapped = true
            // Cache the wrapped version on the instance
            Object.defineProperty(this, property, {
              enumerable: true,
              configurable: true,
              value: wrapped,
            })
            // Call the wrapped function with args
            if (args.length === 0) {
              return wrapped()
            } else if (args.length === 1) {
              return wrapped(args[0])
            } else {
              return wrapped(args[0], ...args.slice(1))
            }
          }
          return originalMethod.apply(this, args)
        },
      })
    }
  }
}
