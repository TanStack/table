import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/react-table'
import type {
  Column,
  OnChangeFn,
  RowData,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/react-table'

export interface MRT_TableState_ColumnDragging {
  draggingColumn: Column<any, any, any> | null
  hoveredColumn: Partial<Column<any, any, any>> | null
}

export interface MRT_TableOptions_ColumnDragging {
  onDraggingColumnChange?: OnChangeFn<Column<any, any, any> | null>
  onHoveredColumnChange?: OnChangeFn<Partial<Column<any, any, any>> | null>
}

export interface MRT_Table_ColumnDragging<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  setDraggingColumn: (
    updater: Updater<Column<TFeatures, TData, unknown> | null>,
  ) => void
  setHoveredColumn: (
    updater: Updater<Partial<Column<TFeatures, TData, unknown>> | null>,
  ) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtColumnDraggingFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtColumnDraggingFeature: MRT_TableState_ColumnDragging
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtColumnDraggingFeature: MRT_TableOptions_ColumnDragging
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtColumnDraggingFeature: MRT_Table_ColumnDragging<TFeatures, TData>
  }
}

/**
 * Tracks the column being dragged and the column currently hovered during a
 * drag/reorder gesture, plus the `setDraggingColumn` / `setHoveredColumn` APIs.
 */
export const mrtColumnDraggingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    draggingColumn: null,
    hoveredColumn: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onDraggingColumnChange: makeStateUpdater('draggingColumn', table),
    onHoveredColumnChange: makeStateUpdater('hoveredColumn', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtColumnDraggingFeature', table, {
      table_setDraggingColumn: {
        fn: (updater: Updater<Column<any, any, any> | null>) =>
          (
            table.options as MRT_TableOptions_ColumnDragging
          ).onDraggingColumnChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setHoveredColumn: {
        fn: (updater: Updater<Partial<Column<any, any, any>> | null>) =>
          (
            table.options as MRT_TableOptions_ColumnDragging
          ).onHoveredColumnChange?.((old) => functionalUpdate(updater, old)),
      },
    })
  },
}
