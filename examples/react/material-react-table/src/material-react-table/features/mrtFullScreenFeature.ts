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

export interface MRT_TableState_FullScreen {
  isFullScreen: boolean
}

export interface MRT_TableOptions_FullScreen {
  enableFullScreenToggle?: boolean
  onIsFullScreenChange?: OnChangeFn<boolean>
}

export interface MRT_Table_FullScreen {
  setIsFullScreen: (updater: Updater<boolean>) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtFullScreenFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtFullScreenFeature: MRT_TableState_FullScreen
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtFullScreenFeature: MRT_TableOptions_FullScreen
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtFullScreenFeature: MRT_Table_FullScreen
  }
}

/**
 * Adds the `isFullScreen` state slice, `onIsFullScreenChange` option, and the
 * `table.setIsFullScreen` API.
 */
export const mrtFullScreenFeature: TableFeature = {
  getInitialState: (initialState) => ({
    isFullScreen: false,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onIsFullScreenChange: makeStateUpdater('isFullScreen', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtFullScreenFeature', table, {
      table_setIsFullScreen: {
        fn: (updater: Updater<boolean>) =>
          (table.options as MRT_TableOptions_FullScreen).onIsFullScreenChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    })
  },
}
