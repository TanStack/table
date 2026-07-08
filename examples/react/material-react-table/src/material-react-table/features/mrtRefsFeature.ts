import type {
  RowData,
  TableFeature,
  TableFeatures,
} from '@tanstack/react-table'
import type { RefObject } from 'react'

export interface MRT_TableRefs {
  actionCellRef: RefObject<HTMLTableCellElement | null>
  bottomToolbarRef: RefObject<HTMLDivElement | null>
  editInputRefs: RefObject<Record<string, HTMLInputElement> | null>
  filterInputRefs: RefObject<Record<string, HTMLInputElement> | null>
  lastSelectedRowId: RefObject<null | string>
  searchInputRef: RefObject<HTMLInputElement | null>
  tableContainerRef: RefObject<HTMLDivElement | null>
  tableFooterRef: RefObject<HTMLTableSectionElement | null>
  tableHeadCellRefs: RefObject<Record<string, HTMLTableCellElement> | null>
  tableHeadRef: RefObject<HTMLTableSectionElement | null>
  tablePaperRef: RefObject<HTMLDivElement | null>
  topToolbarRef: RefObject<HTMLDivElement | null>
}

export interface MRT_Table_Refs {
  refs: MRT_TableRefs
}

declare module '@tanstack/react-table' {
  interface Plugins {
    mrtRefsFeature: TableFeature
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    mrtRefsFeature: MRT_Table_Refs
  }
}

/**
 * The v9 table instance is constructed once (via `useState(() =>
 * constructTable(...))`), so a bag of plain mutable `{ current: null }` refs
 * assigned here persists for the table's lifetime — no `useRef` needed. This
 * replaces the twelve `useRef`s MRT threaded through `useMRT_TableInstance`.
 */
export const mrtRefsFeature: TableFeature = {
  constructTableAPIs: (table) => {
    ;(table as unknown as MRT_Table_Refs).refs = {
      actionCellRef: { current: null },
      bottomToolbarRef: { current: null },
      editInputRefs: { current: null },
      filterInputRefs: { current: null },
      lastSelectedRowId: { current: null },
      searchInputRef: { current: null },
      tableContainerRef: { current: null },
      tableFooterRef: { current: null },
      tableHeadCellRefs: { current: null },
      tableHeadRef: { current: null },
      tablePaperRef: { current: null },
      topToolbarRef: { current: null },
    }
  },
}
