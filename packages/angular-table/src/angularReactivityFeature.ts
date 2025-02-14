import { computed, isSignal, type Signal, signal } from '@angular/core'
import { defineLazyComputedProperty } from './proxy'
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

export interface AngularReactivityFlags {
  header: boolean
  column: boolean
  row: boolean
  cell: boolean
  table: boolean
}

interface TableOptions_AngularReactivity {
  reactivity?: Partial<AngularReactivityFlags>
}

interface Table_AngularReactivity<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  get: Signal<Table<TFeatures, TData>>
  _rootNotifier: Signal<Table<TFeatures, TData>>
  _setRootNotifier: (signal: Signal<Table<TFeatures, TData>>) => void
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

      table._rootNotifier = computed(() => rootNotifier()?.(), {
        equal: () => false,
      }) as any

      table._setRootNotifier = (notifier) => {
        rootNotifier.set(notifier)
      }

      table.get = computed(() => rootNotifier()?.(), {
        equal: () => false,
      }) as any

      setReactiveProps(table._rootNotifier, table, {
        skipProperty: skipBaseProperties,
      })
    },

    constructCellAPIs(cell) {
      if (cell._table.options.reactivity?.cell === false) {
        return
      }
      setReactiveProps(cell._table._rootNotifier, cell, {
        skipProperty: skipBaseProperties,
      })
    },

    constructColumnAPIs(column) {
      if (column._table.options.reactivity?.column === false) {
        return
      }
      setReactiveProps(column._table._rootNotifier, column, {
        skipProperty: skipBaseProperties,
      })
    },

    constructHeaderAPIs(header) {
      if (header._table.options.reactivity?.header === false) {
        return
      }
      setReactiveProps(header._table._rootNotifier, header, {
        skipProperty: skipBaseProperties,
      })
    },

    constructRowAPIs(row) {
      if (row._table.options.reactivity?.row === false) {
        return
      }
      setReactiveProps(row._table._rootNotifier, row, {
        skipProperty: skipBaseProperties,
      })
    },
  }
}

export const angularReactivityFeature = constructAngularReactivityFeature()

function skipBaseProperties(property: string): boolean {
  return (
    // equal `getContext`
    property === 'getContext' ||
    // start with `_`
    property[0] === '_' ||
    // start with `get`
    !(property[0] === 'g' && property[1] === 'e' && property[2] === 't') ||
    // ends with `Handler`
    (property.length >= 7 &&
      property[property.length - 7] === 'H' &&
      property[property.length - 6] === 'a' &&
      property[property.length - 5] === 'n' &&
      property[property.length - 4] === 'd' &&
      property[property.length - 3] === 'l' &&
      property[property.length - 2] === 'e' &&
      property[property.length - 1] === 'r')
  )
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
    })
  }
}
