import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/react-table'
import { createRow } from '../utils/tanstack.helpers'
import type {
  Cell,
  OnChangeFn,
  Row,
  RowData,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/react-table'

export interface MRT_TableState_Editing {
  creatingRow: Row<any, any> | null
  editingCell: Cell<any, any, any> | null
  editingRow: Row<any, any> | null
}

export interface MRT_TableOptions_Editing {
  onCreatingRowChange?: OnChangeFn<Row<any, any> | null>
  onEditingCellChange?: OnChangeFn<Cell<any, any, any> | null>
  onEditingRowChange?: OnChangeFn<Row<any, any> | null>
}

export interface MRT_Table_Editing<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  setCreatingRow: (
    updater: Updater<Row<TFeatures, TData> | null | true>,
  ) => void
  setEditingCell: (
    updater: Updater<Cell<TFeatures, TData, unknown> | null>,
  ) => void
  setEditingRow: (updater: Updater<Row<TFeatures, TData> | null>) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtEditingFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtEditingFeature: MRT_TableState_Editing
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtEditingFeature: MRT_TableOptions_Editing
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtEditingFeature: MRT_Table_Editing<TFeatures, TData>
  }
}

/**
 * Owns the `creatingRow` / `editingCell` / `editingRow` state slices and their
 * setters. `setCreatingRow(true)` is sugar for "start creating a blank row" —
 * it fabricates one via `createRow(table)`, preserving MRT's existing behavior.
 */
export const mrtEditingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    creatingRow: null,
    editingCell: null,
    editingRow: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onCreatingRowChange: makeStateUpdater('creatingRow', table),
    onEditingCellChange: makeStateUpdater('editingCell', table),
    onEditingRowChange: makeStateUpdater('editingRow', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtEditingFeature', table, {
      table_setCreatingRow: {
        fn: (updater: Updater<Row<any, any> | null | true>) =>
          (table.options as MRT_TableOptions_Editing).onCreatingRowChange?.(
            (old) => {
              let next = functionalUpdate(updater, old as any)
              if (next === true) next = createRow(table as any) as any
              return next as Row<any, any> | null
            },
          ),
      },
      table_setEditingCell: {
        fn: (updater: Updater<Cell<any, any, any> | null>) =>
          (table.options as MRT_TableOptions_Editing).onEditingCellChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
      table_setEditingRow: {
        fn: (updater: Updater<Row<any, any> | null>) =>
          (table.options as MRT_TableOptions_Editing).onEditingRowChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    })
  },
}
