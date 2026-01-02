import { computed, signal } from '@angular/core'
import { toComputed } from './proxy'
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

interface TableOptions_AngularReactivity {
  enableExperimentalReactivity?: boolean
}

interface Table_AngularReactivity<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  _rootNotifier?: Signal<Table<TFeatures, TData>>
  _setRootNotifier?: (signal: Signal<Table<TFeatures, TData>>) => void
}

interface AngularReactivityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  TableOptions: TableOptions_AngularReactivity
  Table: Table_AngularReactivity<TFeatures, TData>
}

export function constructAngularReactivityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<AngularReactivityFeatureConstructors<TFeatures, TData>> {
  return {
    getDefaultTableOptions(table) {
      return { enableExperimentalReactivity: false }
    },
    constructTableAPIs: (table) => {
      if (!table.options.enableExperimentalReactivity) {
        return
      }
      const rootNotifier = signal<Signal<any> | null>(null)

      table._rootNotifier = computed(() => rootNotifier()?.(), {
        equal: () => false,
      }) as any

      table._setRootNotifier = (notifier) => {
        rootNotifier.set(notifier)
      }

      // Set reactive props on table instance
      setReactiveProps(table._rootNotifier!, table, {
        skipProperty: skipBaseProperties,
      })
    },

    assignCellPrototype: (prototype, table) => {
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
  return property.endsWith('Handler') || !property.startsWith('get')
}

export function setReactiveProps(
  notifier: Signal<Table<any, any>>,
  obj: { [key: string]: any },
  options: {
    skipProperty: (property: string) => boolean
  },
) {
  const { skipProperty } = options
  for (const property in obj) {
    const value = obj[property]
    if (typeof value !== 'function') {
      continue
    }
    if (skipProperty(property)) {
      continue
    }
    Object.defineProperty(obj, property, {
      enumerable: true,
      configurable: false,
      value: toComputed(notifier, value, property),
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
            ) as any
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
