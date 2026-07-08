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
import type { MRT_ColumnFilterFnsState, MRT_FilterOption } from '../types'

export interface MRT_TableState_FilterModes {
  columnFilterFns: MRT_ColumnFilterFnsState
  globalFilterFn: MRT_FilterOption
  showColumnFilters: boolean
  showGlobalFilter: boolean
}

export interface MRT_TableOptions_FilterModes {
  onColumnFilterFnsChange?: OnChangeFn<MRT_ColumnFilterFnsState>
  onGlobalFilterFnChange?: OnChangeFn<MRT_FilterOption>
  onShowColumnFiltersChange?: OnChangeFn<boolean>
  onShowGlobalFilterChange?: OnChangeFn<boolean>
}

export interface MRT_Table_FilterModes {
  setColumnFilterFns: (updater: Updater<MRT_ColumnFilterFnsState>) => void
  setGlobalFilterFn: (updater: Updater<MRT_FilterOption>) => void
  setShowColumnFilters: (updater: Updater<boolean>) => void
  setShowGlobalFilter: (updater: Updater<boolean>) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtFilterModesFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtFilterModesFeature: MRT_TableState_FilterModes
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtFilterModesFeature: MRT_TableOptions_FilterModes
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtFilterModesFeature: MRT_Table_FilterModes
  }
}

/**
 * MRT-only filtering state that core doesn't own: the per-column filter-fn map
 * (`columnFilterFns`), the chosen global filter fn (`globalFilterFn`), and the
 * two subheader/search visibility flags. Their setters route through the
 * matching `onXChange` options (defaulted to base-atom updaters).
 *
 * The initial `columnFilterFns` map is derived from each column's `filterVariant`
 * in `useMRT_TableInstance` (it needs the column defs, which `getInitialState`
 * can't see) and passed in via `initialState.columnFilterFns`, which overrides
 * the empty default below.
 */
export const mrtFilterModesFeature: TableFeature = {
  getInitialState: (initialState) => ({
    columnFilterFns: {},
    globalFilterFn: 'fuzzy',
    showColumnFilters: false,
    showGlobalFilter: false,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onColumnFilterFnsChange: makeStateUpdater('columnFilterFns', table),
    onGlobalFilterFnChange: makeStateUpdater('globalFilterFn', table),
    onShowColumnFiltersChange: makeStateUpdater('showColumnFilters', table),
    onShowGlobalFilterChange: makeStateUpdater('showGlobalFilter', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtFilterModesFeature', table, {
      table_setColumnFilterFns: {
        fn: (updater: Updater<MRT_ColumnFilterFnsState>) =>
          (
            table.options as MRT_TableOptions_FilterModes
          ).onColumnFilterFnsChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setGlobalFilterFn: {
        fn: (updater: Updater<MRT_FilterOption>) =>
          (
            table.options as MRT_TableOptions_FilterModes
          ).onGlobalFilterFnChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setShowColumnFilters: {
        fn: (updater: Updater<boolean>) =>
          (
            table.options as MRT_TableOptions_FilterModes
          ).onShowColumnFiltersChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
      table_setShowGlobalFilter: {
        fn: (updater: Updater<boolean>) =>
          (
            table.options as MRT_TableOptions_FilterModes
          ).onShowGlobalFilterChange?.((old) => functionalUpdate(updater, old)),
      },
    })
  },
}
