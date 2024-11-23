import { computed, signal } from '@angular/core'
import { toComputed } from './proxy'
import type { Signal } from '@angular/core'
import type { Table, TableFeature } from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface TableOptions_Plugins {
    enableExperimentalReactivity?: boolean
  }

  interface Table_Plugins {
    _rootNotifier?: Signal<Table<any, any>>
    _setRootNotifier?: (signal: Signal<Table<any, any>>) => void
  }
}

export const reactivityFeature: TableFeature = {
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

    setReactiveProps(table._rootNotifier!, table, {
      skipProperty: skipBaseProperties,
    })
  },

  constructCellAPIs(cell) {
    if (
      !cell.table.options.enableExperimentalReactivity ||
      !cell.table._rootNotifier
    ) {
      return
    }
    setReactiveProps(cell.table._rootNotifier, cell, {
      skipProperty: skipBaseProperties,
    })
  },

  constructColumnAPIs(column) {
    if (
      !column.table.options.enableExperimentalReactivity ||
      !column.table._rootNotifier
    ) {
      return
    }
    setReactiveProps(column.table._rootNotifier, column, {
      skipProperty: skipBaseProperties,
    })
  },

  constructHeaderAPIs(header) {
    if (
      !header.table.options.enableExperimentalReactivity ||
      !header.table._rootNotifier
    ) {
      return
    }
    setReactiveProps(header.table._rootNotifier, header, {
      skipProperty: skipBaseProperties,
    })
  },

  constructRowAPIs(row) {
    if (
      !row.table.options.enableExperimentalReactivity ||
      !row.table._rootNotifier
    ) {
      return
    }
    setReactiveProps(row.table._rootNotifier, row, {
      skipProperty: skipBaseProperties,
    })
  },
}

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
