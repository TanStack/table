import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/angular-table'
import type {
  OnChangeFn,
  RowData,
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

declare module '@tanstack/angular-table' {
  interface Plugins {
    densityPlugin: TableFeature
  }

  interface TableState_FeatureMap {
    densityPlugin: TableState_Density
  }

  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityPlugin: TableOptions_Density
  }

  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityPlugin: Table_Density
  }
}

// Here is all of the actual javascript code for our new feature
export const densityPlugin: TableFeature = {
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
    assignTableAPIs('densityPlugin', table, {
      table_setDensity: {
        fn: (updater: Updater<DensityState>) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            const newState = functionalUpdate(updater, old)
            return newState
          }
          return table.options.onDensityChange?.(safeUpdater)
        },
      },
      table_toggleDensity: {
        fn: (value?: DensityState) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            if (value) return value
            return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // cycle through the 3 options
          }
          return table.options.onDensityChange?.(safeUpdater)
        },
      },
    })
  },
}
// end of custom feature code
