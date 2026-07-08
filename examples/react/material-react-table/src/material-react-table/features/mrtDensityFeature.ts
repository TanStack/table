import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/react-table'
import type {
  OnChangeFn,
  RowData,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/react-table'
import type { MRT_DensityState } from '../types'

export interface MRT_TableState_Density {
  density: MRT_DensityState
}

export interface MRT_TableOptions_Density {
  enableDensityToggle?: boolean
  onDensityChange?: OnChangeFn<MRT_DensityState>
}

export interface MRT_Table_Density {
  setDensity: (updater: Updater<MRT_DensityState>) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtDensityFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtDensityFeature: MRT_TableState_Density
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtDensityFeature: MRT_TableOptions_Density
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtDensityFeature: MRT_Table_Density
  }
}

/**
 * Adds the MRT-only `density` state slice, the `onDensityChange` option
 * (defaulted to a base-atom updater), and the `table.setDensity` API.
 *
 * In v9 a custom feature's `getInitialState` key automatically gets a base
 * atom, `table.state.density` tracking, controlled-state sync, and Subscribe —
 * so this replaces the hand-rolled atom + setter that MRT maintained in
 * `useMRT_TableInstance`.
 */
export const mrtDensityFeature: TableFeature = {
  getInitialState: (initialState) => ({
    density: 'comfortable',
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onDensityChange: makeStateUpdater('density', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtDensityFeature', table, {
      table_setDensity: {
        fn: (updater: Updater<MRT_DensityState>) =>
          (table.options as MRT_TableOptions_Density).onDensityChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    })
  },
}
