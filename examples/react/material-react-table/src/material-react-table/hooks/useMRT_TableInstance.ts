import { useMemo, useRef } from 'react'
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import { useTable } from '@tanstack/react-table'
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '../utils/column.utils'
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '../utils/displayColumn.utils'
import { createRow } from '../utils/tanstack.helpers'
import { getMRT_RowActionsColumnDef } from './display-columns/getMRT_RowActionsColumnDef'
import { getMRT_RowDragColumnDef } from './display-columns/getMRT_RowDragColumnDef'
import { getMRT_RowExpandColumnDef } from './display-columns/getMRT_RowExpandColumnDef'
import { getMRT_RowNumbersColumnDef } from './display-columns/getMRT_RowNumbersColumnDef'
import { getMRT_RowPinningColumnDef } from './display-columns/getMRT_RowPinningColumnDef'
import { getMRT_RowSelectColumnDef } from './display-columns/getMRT_RowSelectColumnDef'
import { getMRT_RowSpacerColumnDef } from './display-columns/getMRT_RowSpacerColumnDef'
import { useMRT_Effects } from './useMRT_Effects'
import type {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_ColumnFilterFnsState,
  MRT_ColumnOrderState,
  MRT_ColumnResizingState,
  MRT_DefinedTableOptions,
  MRT_DensityState,
  MRT_FilterOption,
  MRT_GroupingState,
  MRT_PaginationState,
  MRT_Row,
  MRT_RowData,
  MRT_StatefulTableOptions,
  MRT_TableInstance,
  MRT_TableState,
  MRT_Updater,
} from '../types'

/**
 * The MRT hook that wraps the TanStack `useTable` hook and adds MRT-specific
 * state, refs, and helpers. State management is built on top of TanStack
 * Store atoms (`useCreateAtom` from `@tanstack/react-store`):
 *
 * - **TanStack-aware slices** (`columnOrder`, `columnResizing`, `grouping`,
 *   `pagination`) are passed via the `atoms` option on `useTable`. Library
 *   writes (e.g. `table.setSorting(...)`, `table.firstPage()`) flow directly
 *   through these atoms, and they're automatically tracked in
 *   `table.state` by the v9 store.
 * - **MRT-only slices** (`density`, `isFullScreen`, `actionCell`,
 *   `creatingRow`, `editingCell`, `editingRow`, `draggingColumn`,
 *   `draggingRow`, `hoveredColumn`, `hoveredRow`, `globalFilterFn`,
 *   `columnFilterFns`, `showAlertBanner`, `showColumnFilters`,
 *   `showGlobalFilter`, `showToolbarDropZone`) live in atoms outside the
 *   v9 store and are merged into `table.state` after construction so MRT
 *   components can read them via the same `state` surface.
 *
 * @param definedTableOptions - table options with proper defaults set
 * @returns the MRT table instance
 */
export const useMRT_TableInstance = <TData extends MRT_RowData>(
  definedTableOptions: MRT_DefinedTableOptions<TData>,
): MRT_TableInstance<TData> => {
  const lastSelectedRowId = useRef<null | string>(null)
  const actionCellRef = useRef<HTMLTableCellElement>(null)
  const bottomToolbarRef = useRef<HTMLDivElement>(null)
  const editInputRefs = useRef<Record<string, HTMLInputElement>>({})
  const filterInputRefs = useRef<Record<string, HTMLInputElement>>({})
  const searchInputRef = useRef<HTMLInputElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({})
  const tablePaperRef = useRef<HTMLDivElement>(null)
  const topToolbarRef = useRef<HTMLDivElement>(null)
  const tableHeadRef = useRef<HTMLTableSectionElement>(null)
  const tableFooterRef = useRef<HTMLTableSectionElement>(null)

  // transform initial state with proper column order
  const initialState: Partial<MRT_TableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {}
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as MRT_StatefulTableOptions<TData>)
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy'
    return initState
  }, [])

  definedTableOptions.initialState = initialState

  // ---------------------------------------------------------------------------
  // TanStack-aware atoms (passed to `useTable` via `atoms` option). The library
  // both reads and writes through these.
  // ---------------------------------------------------------------------------
  const columnOrderAtom = useCreateAtom<MRT_ColumnOrderState>(
    initialState.columnOrder ?? [],
  )
  const columnResizingAtom = useCreateAtom<MRT_ColumnResizingState>(
    initialState.columnResizing ?? ({} as MRT_ColumnResizingState),
  )
  const groupingAtom = useCreateAtom<MRT_GroupingState>(
    initialState.grouping ?? [],
  )
  const paginationAtom = useCreateAtom<MRT_PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  )

  // Subscribe so the consumer re-renders when these slices change. (The library
  // also reads from these atoms internally; the subscriptions here are for the
  // MRT component tree.)
  const columnOrder = useSelector(columnOrderAtom)
  const columnResizing = useSelector(columnResizingAtom)
  const grouping = useSelector(groupingAtom)
  const pagination = useSelector(paginationAtom)

  // ---------------------------------------------------------------------------
  // MRT-only atoms — these slices aren't part of v9's `TableState` so they
  // can't be passed via the `atoms` option. They're maintained as standalone
  // atoms and merged into `table.state` after construction.
  // ---------------------------------------------------------------------------
  const actionCellAtom = useCreateAtom<MRT_Cell<TData> | null>(
    initialState.actionCell ?? null,
  )
  const creatingRowAtom = useCreateAtom<MRT_Row<TData> | null>(
    initialState.creatingRow ?? null,
  )
  // Build the initial columnFilterFns map from each column's `filterFn` (or
  // the registered default if none set). Constructed as a plain Record so
  // `useCreateAtom`'s overload resolves to `Atom<T>` (writable) rather than
  // the function-style `ReadonlyAtom<T>` overload.
  const initialColumnFilterFns: MRT_ColumnFilterFnsState = {}
  for (const col of getAllLeafColumnDefs(
    definedTableOptions.columns as Array<MRT_ColumnDef<TData>>,
  )) {
    initialColumnFilterFns[getColumnId(col)] =
      col.filterFn instanceof Function
        ? (col.filterFn.name ?? 'custom')
        : (col.filterFn ??
          initialState?.columnFilterFns?.[getColumnId(col)] ??
          getDefaultColumnFilterFn(col))
  }
  const columnFilterFnsAtom = useCreateAtom<MRT_ColumnFilterFnsState>(
    initialColumnFilterFns,
  )
  const densityAtom = useCreateAtom<MRT_DensityState>(
    initialState?.density ?? 'comfortable',
  )
  const draggingColumnAtom = useCreateAtom<MRT_Column<TData> | null>(
    initialState.draggingColumn ?? null,
  )
  const draggingRowAtom = useCreateAtom<MRT_Row<TData> | null>(
    initialState.draggingRow ?? null,
  )
  const editingCellAtom = useCreateAtom<MRT_Cell<TData> | null>(
    initialState.editingCell ?? null,
  )
  const editingRowAtom = useCreateAtom<MRT_Row<TData> | null>(
    initialState.editingRow ?? null,
  )
  const globalFilterFnAtom = useCreateAtom<MRT_FilterOption>(
    initialState.globalFilterFn ?? 'fuzzy',
  )
  const hoveredColumnAtom = useCreateAtom<Partial<MRT_Column<TData>> | null>(
    initialState.hoveredColumn ?? null,
  )
  const hoveredRowAtom = useCreateAtom<Partial<MRT_Row<TData>> | null>(
    initialState.hoveredRow ?? null,
  )
  const isFullScreenAtom = useCreateAtom<boolean>(
    initialState?.isFullScreen ?? false,
  )
  const showAlertBannerAtom = useCreateAtom<boolean>(
    initialState?.showAlertBanner ?? false,
  )
  const showColumnFiltersAtom = useCreateAtom<boolean>(
    initialState?.showColumnFilters ?? false,
  )
  const showGlobalFilterAtom = useCreateAtom<boolean>(
    initialState?.showGlobalFilter ?? false,
  )
  const showToolbarDropZoneAtom = useCreateAtom<boolean>(
    initialState?.showToolbarDropZone ?? false,
  )

  const actionCell = useSelector(actionCellAtom)
  const creatingRow = useSelector(creatingRowAtom)
  const columnFilterFns = useSelector(columnFilterFnsAtom)
  const density = useSelector(densityAtom)
  const draggingColumn = useSelector(draggingColumnAtom)
  const draggingRow = useSelector(draggingRowAtom)
  const editingCell = useSelector(editingCellAtom)
  const editingRow = useSelector(editingRowAtom)
  const globalFilterFn = useSelector(globalFilterFnAtom)
  const hoveredColumn = useSelector(hoveredColumnAtom)
  const hoveredRow = useSelector(hoveredRowAtom)
  const isFullScreen = useSelector(isFullScreenAtom)
  const showAlertBanner = useSelector(showAlertBannerAtom)
  const showColumnFilters = useSelector(showColumnFiltersAtom)
  const showGlobalFilter = useSelector(showGlobalFilterAtom)
  const showToolbarDropZone = useSelector(showToolbarDropZoneAtom)

  // Mirror values into options.state so utilities that read
  // `tableOptions.state.X` (e.g. column prep, display-column factories) keep
  // working. The user can still override individual slices by setting
  // `definedTableOptions.state` from outside.
  definedTableOptions.state = {
    actionCell,
    columnFilterFns,
    columnOrder,
    columnResizing,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    globalFilterFn,
    grouping,
    hoveredColumn,
    hoveredRow,
    isFullScreen,
    pagination,
    showAlertBanner,
    showColumnFilters,
    showGlobalFilter,
    showToolbarDropZone,
    ...definedTableOptions.state,
  }

  // The table options now include all state needed to help determine column visibility and order logic
  const statefulTableOptions =
    definedTableOptions as MRT_StatefulTableOptions<TData>

  // don't recompute columnDefs while resizing column or dragging column/row
  const columnDefsRef = useRef<Array<MRT_ColumnDef<TData>>>([])
  statefulTableOptions.columns =
    statefulTableOptions.state.columnResizing.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              showRowPinningColumn(statefulTableOptions) &&
                getMRT_RowPinningColumnDef(statefulTableOptions),
              showRowDragColumn(statefulTableOptions) &&
                getMRT_RowDragColumnDef(statefulTableOptions),
              showRowActionsColumn(statefulTableOptions) &&
                getMRT_RowActionsColumnDef(statefulTableOptions),
              showRowExpandColumn(statefulTableOptions) &&
                getMRT_RowExpandColumnDef(statefulTableOptions),
              showRowSelectionColumn(statefulTableOptions) &&
                getMRT_RowSelectColumnDef(statefulTableOptions),
              showRowNumbersColumn(statefulTableOptions) &&
                getMRT_RowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as Array<MRT_ColumnDef<TData>>),
            ...statefulTableOptions.columns,
            ...([
              showRowSpacerColumn(statefulTableOptions) &&
                getMRT_RowSpacerColumnDef(statefulTableOptions),
            ].filter(Boolean) as Array<MRT_ColumnDef<TData>>),
          ],
          tableOptions: statefulTableOptions,
        })
  columnDefsRef.current = statefulTableOptions.columns

  // if loading, generate blank rows to show skeleton loaders
  statefulTableOptions.data = useMemo(
    () =>
      (statefulTableOptions.state.isLoading ||
        statefulTableOptions.state.showSkeletons) &&
      !statefulTableOptions.data.length
        ? [
            ...Array(
              Math.min(statefulTableOptions.state.pagination.pageSize, 20),
            ).fill(null),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(statefulTableOptions.columns).map(
                (col) => ({
                  [getColumnId(col)]: null,
                }),
              ),
            ),
          )
        : statefulTableOptions.data,
    [
      statefulTableOptions.data,
      statefulTableOptions.state.isLoading,
      statefulTableOptions.state.showSkeletons,
    ],
  )

  const table = useTable(
    {
      ...(statefulTableOptions as any),
      globalFilterFn: (globalFilterFn ?? 'fuzzy') as any,
      // Hand TanStack-aware slices over to our external atoms — library writes
      // (e.g. `table.setPageIndex(...)`, drag-resize) flow straight into them.
      atoms: {
        columnOrder: columnOrderAtom,
        columnResizing: columnResizingAtom,
        grouping: groupingAtom,
        pagination: paginationAtom,
      },
    },
    (state) => state,
  ) as unknown as MRT_TableInstance<TData>

  // v9 spells the resize setter `setcolumnResizing` (lowercase 'c') because
  // it's auto-generated from the state-key name. Expose a camelCase alias so
  // MRT consumers don't need to know about that quirk; route writes through
  // our owned atom directly.
  table.setColumnResizing = columnResizingAtom.set as any

  // The v9 store doesn't track MRT-only slices, so `table.state` is missing
  // them after `useTable` returns. Patch them in here so all MRT components
  // can read `table.state.density`, `table.state.isFullScreen`, etc.
  table.state = {
    ...table.state,
    actionCell,
    columnFilterFns,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    globalFilterFn,
    hoveredColumn,
    hoveredRow,
    isFullScreen,
    showAlertBanner,
    showColumnFilters,
    showGlobalFilter,
    showToolbarDropZone,
  }

  // v8-style `getState()` alias for any consumer that still calls it.
  table.getState = () => table.state

  table.refs = {
    actionCellRef,
    bottomToolbarRef,
    editInputRefs,
    filterInputRefs,
    lastSelectedRowId,
    searchInputRef,
    tableContainerRef,
    tableFooterRef,
    tableHeadCellRefs,
    tableHeadRef,
    tablePaperRef,
    topToolbarRef,
  }

  // Setters write through atom.set (or call the user-supplied on*Change
  // handler if one was provided so external state ownership still works).
  // The `as any` casts bridge atom.set's overloaded signature with React's
  // `Dispatch<SetStateAction<T>>` shape — the runtime contract is identical
  // (both accept a value or an updater function).
  table.setActionCell = (statefulTableOptions.onActionCellChange ??
    actionCellAtom.set) as any
  table.setCreatingRow = (row: MRT_Updater<MRT_Row<TData> | null | true>) => {
    let _row = row
    if (row === true) {
      _row = createRow(table)
    }
    statefulTableOptions?.onCreatingRowChange?.(
      _row as MRT_Row<TData> | null,
    ) ?? creatingRowAtom.set(_row as MRT_Row<TData> | null)
  }
  table.setColumnFilterFns = (statefulTableOptions.onColumnFilterFnsChange ??
    columnFilterFnsAtom.set) as any
  table.setDensity = (statefulTableOptions.onDensityChange ??
    densityAtom.set) as any
  table.setDraggingColumn = (statefulTableOptions.onDraggingColumnChange ??
    draggingColumnAtom.set) as any
  table.setDraggingRow = (statefulTableOptions.onDraggingRowChange ??
    draggingRowAtom.set) as any
  table.setEditingCell = (statefulTableOptions.onEditingCellChange ??
    editingCellAtom.set) as any
  table.setEditingRow = (statefulTableOptions.onEditingRowChange ??
    editingRowAtom.set) as any
  table.setGlobalFilterFn = (statefulTableOptions.onGlobalFilterFnChange ??
    globalFilterFnAtom.set) as any
  table.setHoveredColumn = (statefulTableOptions.onHoveredColumnChange ??
    hoveredColumnAtom.set) as any
  table.setHoveredRow = (statefulTableOptions.onHoveredRowChange ??
    hoveredRowAtom.set) as any
  table.setIsFullScreen = (statefulTableOptions.onIsFullScreenChange ??
    isFullScreenAtom.set) as any
  table.setShowAlertBanner = (statefulTableOptions.onShowAlertBannerChange ??
    showAlertBannerAtom.set) as any
  table.setShowColumnFilters =
    (statefulTableOptions.onShowColumnFiltersChange ??
      showColumnFiltersAtom.set) as any
  table.setShowGlobalFilter = (statefulTableOptions.onShowGlobalFilterChange ??
    showGlobalFilterAtom.set) as any
  table.setShowToolbarDropZone =
    (statefulTableOptions.onShowToolbarDropZoneChange ??
      showToolbarDropZoneAtom.set) as any

  useMRT_Effects(table)

  return table
}
