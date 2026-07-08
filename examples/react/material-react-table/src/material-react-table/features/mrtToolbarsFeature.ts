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

export interface MRT_TableState_Toolbars {
  showAlertBanner: boolean
  showToolbarDropZone: boolean
}

export interface MRT_TableOptions_Toolbars {
  onShowAlertBannerChange?: OnChangeFn<boolean>
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>
}

export interface MRT_Table_Toolbars {
  setShowAlertBanner: (updater: Updater<boolean>) => void
  setShowToolbarDropZone: (updater: Updater<boolean>) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtToolbarsFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtToolbarsFeature: MRT_TableState_Toolbars
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtToolbarsFeature: MRT_TableOptions_Toolbars
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtToolbarsFeature: MRT_Table_Toolbars
  }
}

/**
 * Tracks the toolbar alert banner / drop-zone visibility flags plus their
 * `setShowAlertBanner` / `setShowToolbarDropZone` APIs.
 */
export const mrtToolbarsFeature: TableFeature = {
  getInitialState: (initialState) => ({
    showAlertBanner: false,
    showToolbarDropZone: false,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onShowAlertBannerChange: makeStateUpdater('showAlertBanner', table),
    onShowToolbarDropZoneChange: makeStateUpdater('showToolbarDropZone', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtToolbarsFeature', table, {
      table_setShowAlertBanner: {
        fn: (updater: Updater<boolean>) =>
          (
            table.options as MRT_TableOptions_Toolbars
          ).onShowAlertBannerChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setShowToolbarDropZone: {
        fn: (updater: Updater<boolean>) =>
          (
            table.options as MRT_TableOptions_Toolbars
          ).onShowToolbarDropZoneChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    })
  },
}
