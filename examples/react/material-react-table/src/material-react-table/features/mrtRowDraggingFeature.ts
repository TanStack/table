import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/react-table'
import type {
  OnChangeFn,
  Row,
  RowData,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/react-table'

export interface MRT_TableState_RowDragging {
  draggingRow: Row<any, any> | null
  hoveredRow: Partial<Row<any, any>> | null
}

export interface MRT_TableOptions_RowDragging {
  onDraggingRowChange?: OnChangeFn<Row<any, any> | null>
  onHoveredRowChange?: OnChangeFn<Partial<Row<any, any>> | null>
}

export interface MRT_Table_RowDragging<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  setDraggingRow: (updater: Updater<Row<TFeatures, TData> | null>) => void
  setHoveredRow: (
    updater: Updater<Partial<Row<TFeatures, TData>> | null>,
  ) => void
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtRowDraggingFeature: TableFeature
  }
  interface TableState_FeatureMap {
    mrtRowDraggingFeature: MRT_TableState_RowDragging
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtRowDraggingFeature: MRT_TableOptions_RowDragging
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtRowDraggingFeature: MRT_Table_RowDragging<TFeatures, TData>
  }
}

/**
 * Tracks the row being dragged and the row currently hovered during a
 * drag/reorder gesture, plus the `setDraggingRow` / `setHoveredRow` APIs.
 */
export const mrtRowDraggingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    draggingRow: null,
    hoveredRow: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onDraggingRowChange: makeStateUpdater('draggingRow', table),
    onHoveredRowChange: makeStateUpdater('hoveredRow', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('mrtRowDraggingFeature', table, {
      table_setDraggingRow: {
        fn: (updater: Updater<Row<any, any> | null>) =>
          (table.options as MRT_TableOptions_RowDragging).onDraggingRowChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
      table_setHoveredRow: {
        fn: (updater: Updater<Partial<Row<any, any>> | null>) =>
          (table.options as MRT_TableOptions_RowDragging).onHoveredRowChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    })
  },
}
