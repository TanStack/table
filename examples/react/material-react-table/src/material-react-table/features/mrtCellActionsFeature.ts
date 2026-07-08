import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/react-table'
import type {
  Cell,
  OnChangeFn,
  RowData,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/react-table'

/**
 * `TableState_FeatureMap` is non-generic, so instance-bearing slices are typed
 * with `Cell<any, any, any>`. The `MRT_Cell<TData>` shape is what components see
 * through the (Phase 1) `MRT_TableInstance` wrapper.
 */
export interface MRT_TableState_CellActions {
  actionCell: Cell<any, any, any> | null
}

export interface MRT_TableOptions_CellActions {
  onActionCellChange?: OnChangeFn<Cell<any, any, any> | null>
}

export interface MRT_Table_CellActions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  setActionCell: (
    updater: Updater<Cell<TFeatures, TData, unknown> | null>,
  ) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtCellActionsFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtCellActionsFeature: MRT_TableState_CellActions
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtCellActionsFeature: MRT_TableOptions_CellActions
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtCellActionsFeature: MRT_Table_CellActions<TFeatures, TData>
  }
}

/**
 * Tracks the cell whose action menu is open (`actionCell`) plus the
 * `table.setActionCell` API.
 */
export const mrtCellActionsFeature: TableFeature = {
  getInitialState: (initialState) => ({
    actionCell: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onActionCellChange: makeStateUpdater('actionCell', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtCellActionsFeature', table, {
      table_setActionCell: {
        fn: (updater: Updater<Cell<any, any, any> | null>) =>
          (table.options as MRT_TableOptions_CellActions).onActionCellChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    })
  },
}
