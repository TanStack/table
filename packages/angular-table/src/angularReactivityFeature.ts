import { computed, isSignal, signal } from '@angular/core'
import { defineLazyComputedProperty } from './reactivityUtils'
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
  _setTableNotifier: (signal: Signal<Table<TFeatures, TData>>) => void
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
      const rootNotifier = signal<Signal<Table<TableFeatures, TData>> | null>(
        null,
      )

      table._setTableNotifier = (notifier) => {
        rootNotifier.set(notifier)
      }

      table.get = computed(() => rootNotifier()!(), {
        equal: () => false,
      })

      setReactiveProps(table.get, table, {
        skipProperty: skipBaseProperties,
      })
    },

    constructCellAPIs(cell) {
      if (cell._table.options.reactivity?.cell === false) {
        return
      }
      setReactiveProps(cell._table.get, cell, {
        skipProperty: skipBaseProperties,
      })
    },

    constructColumnAPIs(column) {
      if (column._table.options.reactivity?.column === false) {
        return
      }
      setReactiveProps(column._table.get, column, {
        skipProperty: skipBaseProperties,
      })
    },

    constructHeaderAPIs(header) {
      if (header._table.options.reactivity?.header === false) {
        return
      }
      setReactiveProps(header._table.get, header, {
        skipProperty: skipBaseProperties,
      })
    },

    constructRowAPIs(row) {
      if (row._table.options.reactivity?.row === false) {
        return
      }
      setReactiveProps(row._table.get, row, {
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

function setReactiveProps(
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
