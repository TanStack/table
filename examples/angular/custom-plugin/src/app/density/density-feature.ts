import { functionalUpdate, makeStateUpdater } from '@tanstack/angular-table'
import type {
  OnChangeFn,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/angular-table'

// TypeScript setup for our new feature with all of the same type-safety as stock TanStack Table features

// define types for our new feature's custom state
export type DensityState = 'sm' | 'md' | 'lg'
export interface TableState_Density {
  density: DensityState
}

// define types for our new feature's table options
export interface TableOptions_Density {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// Define types for our new feature's table APIs
export interface Table_Density {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}

interface DensityPluginConstructors<TFeatures extends TableFeatures, TData> {
  Table: Table_Density
  TableOptions: TableOptions_Density
  TableState: TableState_Density
}

// Here is all of the actual javascript code for our new feature
export const densityPlugin: TableFeature<
  DensityPluginConstructors<TableFeatures, Table_Density>
> = {
  // define the new feature's initial state
  getInitialState: (initialState) => {
    return {
      density: 'md',
      ...initialState, // must come last
    }
  },

  // define the new feature's default options
  getDefaultTableOptions: (table) => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    }
  },
  // if you need to add a default column definition...
  // getDefaultColumnDef: () => {},

  // define the new feature's table instance methods
  constructTableAPIs: (table) => {
    table.setDensity = (updater) => {
      const safeUpdater: Updater<DensityState> = (old) => {
        const newState = functionalUpdate(updater, old)
        return newState
      }
      return table.options.onDensityChange?.(safeUpdater)
    }
    table.toggleDensity = (value) => {
      table.setDensity?.((old) => {
        if (value) return value
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // cycle through the 3 options
      })
    }
  },

  // if you need to add row instance APIs...
  // constructRowAPIs: (row) => {},

  // if you need to add cell instance APIs...
  // constructCellAPIs: (cell) => {},

  // if you need to add column instance APIs...
  // constructColumnAPIs: (column) => {},

  // if you need to add header instance APIs...
  // constructHeaderAPIs: (header) => {},
}
// end of custom feature code
