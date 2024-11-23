import type { Signal } from '@angular/core'
import { computed, signal } from '@angular/core'
import { type TableFeature } from '@tanstack/table-core'
import { toComputed } from './proxy'

declare module '@tanstack/table-core' {
  interface TableOptions_Plugins {
    debugReactivity?: boolean
  }

  interface Table_Plugins {
    _signalNotifier: Signal<unknown>
    _notify: () => void
    _setNotifier: (signal: Signal<unknown>) => void
    debugReactivity?: boolean
  }
}

export const reactivityFeature: TableFeature = {
  getDefaultTableOptions(table) {
    return { debugReactivity: false }
  },
  constructTableAPIs: (table) => {
    const internalNotifier = signal<Signal<any> | null>(null)

    table._signalNotifier = computed(() => internalNotifier()?.(), {
      equal: () => false,
    }) as any

    table._setNotifier = (notifier) => {
      internalNotifier.set(notifier)
      table._notify = notifier
    }

    makePropsReactive(table._signalNotifier, table, {
      skipProperty: (property) => false,
      enableDebug: table.options.debugReactivity ?? false,
      debugKey: 'table',
    })
  },

  constructCellAPIs(cell) {
    makePropsReactive(cell.table._signalNotifier, cell, {
      skipProperty(property) {
        return false
      },
      debugKey: `cell ${cell.id}`,
      enableDebug: cell.table.options.debugReactivity ?? false,
    })
  },

  constructColumnAPIs(column) {
    makePropsReactive(column.table._signalNotifier, column, {
      skipProperty(property) {
        return false
      },
      debugKey: `column ${column.id}`,
      enableDebug: column.table.options.debugReactivity ?? false,
    })
  },

  constructHeaderAPIs(header) {
    makePropsReactive(header.table._signalNotifier, header, {
      skipProperty(property) {
        return false
      },
      debugKey: `header ${header.id}`,
      enableDebug: header.table.options.debugReactivity ?? false,
    })
  },

  constructRowAPIs(row) {
    const rowId = row.id
    makePropsReactive(row.table._signalNotifier, row, {
      skipProperty(property) {
        return false
      },
      debugKey: `row ${rowId}`,
      enableDebug: row.table.options.debugReactivity ?? false,
    })
  },
}

export function makePropsReactive(
  notifier: Signal<unknown>,
  obj: { [key: string]: any },
  options: {
    skipProperty: (property: string) => boolean
    debugKey: string
    enableDebug: boolean
  },
) {
  options.enableDebug &&
    console.groupCollapsed('Table enabled reactivity - ', options.debugKey)

  const { skipProperty } = options
  for (const property in obj) {
    if (property.endsWith('Handler') || !property.startsWith('get')) {
      options.enableDebug && console.warn('Skipping property', property)
      continue
    }
    if (skipProperty(property)) {
      options.enableDebug && console.warn('Skipping property', property)
      continue
    }

    options.enableDebug && console.log('Making reactive prop', property)

    const value = obj[property]
    if (typeof value === 'function') {
      Object.defineProperty(obj, property, {
        enumerable: true,
        configurable: false,
        value: toComputed(notifier as any, value, property),
      })
    }
  }
  options.enableDebug && console.groupEnd()
}
