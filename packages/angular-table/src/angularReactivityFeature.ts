import { computed, isSignal, signal } from '@angular/core'
import { defineLazyComputedProperty, markReactive } from './reactivityUtils'
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
}

interface TableOptions_AngularReactivity {
  reactivity?: Partial<AngularReactivityFlags>
}

interface Table_AngularReactivity<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns a table signal that updates whenever the table state or options changes.
   */
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

function constructAngularReactivityFeature<
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
        },
      }
    },
    constructTableAPIs: (table) => {
      const rootNotifier = signal<Signal<any> | null>(null)
      table.setTableNotifier = (notifier) => rootNotifier.set(notifier)
      table.get = computed(() => rootNotifier()!(), { equal: () => false })
      markReactive(table)
      setReactiveProps(table.get, table, {
        overridePrototype: false,
        skipProperty: skipBaseProperties,
      })
    },

    assignCellPrototype: (prototype, table) => {
      if (table.options.reactivity?.cell === false) {
        return
      }
      markReactive(prototype)
      setReactiveProps(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },

    assignColumnPrototype: (prototype, table) => {
      if (table.options.reactivity?.column === false) {
        return
      }
      markReactive(prototype)
      setReactiveProps(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },

    assignHeaderPrototype: (prototype, table) => {
      if (table.options.reactivity?.header === false) {
        return
      }
      markReactive(prototype)
      setReactiveProps(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
      })
    },

    assignRowPrototype: (prototype, table) => {
      if (table.options.reactivity?.row === false) {
        return
      }
      markReactive(prototype)
      setReactiveProps(table.get, prototype, {
        skipProperty: getUserSkipPropertyFn(
          table.options.reactivity?.cell,
          skipBaseProperties,
        ),
        overridePrototype: true,
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
    overridePrototype?: boolean
    skipProperty: (property: string) => boolean
  },
) {
  const { skipProperty } = options

  for (const property in obj) {
    const value = obj[property]
    if (
      isSignal(value) ||
      typeof value !== 'function' ||
      skipProperty(property)
    ) {
      continue
    }
    defineLazyComputedProperty(notifier, {
      valueFn: value,
      property,
      originalObject: obj,
      overridePrototype: options.overridePrototype,
    })
  }
}
