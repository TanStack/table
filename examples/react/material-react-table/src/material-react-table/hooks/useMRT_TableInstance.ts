import { useMemo, useRef } from 'react'
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
import { useAppTable } from './mrtTableHook'
import { getMRT_RowActionsColumnDef } from './display-columns/getMRT_RowActionsColumnDef'
import { getMRT_RowDragColumnDef } from './display-columns/getMRT_RowDragColumnDef'
import { getMRT_RowExpandColumnDef } from './display-columns/getMRT_RowExpandColumnDef'
import { getMRT_RowNumbersColumnDef } from './display-columns/getMRT_RowNumbersColumnDef'
import { getMRT_RowPinningColumnDef } from './display-columns/getMRT_RowPinningColumnDef'
import { getMRT_RowSelectColumnDef } from './display-columns/getMRT_RowSelectColumnDef'
import { getMRT_RowSpacerColumnDef } from './display-columns/getMRT_RowSpacerColumnDef'
import { useMRT_Effects } from './useMRT_Effects'
import type {
  MRT_ColumnDef,
  MRT_ColumnFilterFnsState,
  MRT_DefinedTableOptions,
  MRT_RowData,
  MRT_StatefulTableOptions,
  MRT_TableInstance,
  MRT_TableState,
} from '../types'

/**
 * Wraps the TanStack v9 `useTable` hook, adding the MRT display-column
 * injection, skeleton-row fabrication, and initial-state massaging that can't
 * live inside a feature.
 *
 * All MRT-only state, setters, and refs now come from the custom features
 * bundled in `mrtFeatures` (see `../features`). `useTable` constructs a base
 * atom for every feature-contributed state key, so `table.state.density`,
 * `table.setDensity`, `table.refs`, etc. are all provided natively — the
 * hand-rolled atoms, setter aliases, and `table.state` patching that MRT
 * previously maintained here are gone.
 */
export const useMRT_TableInstance = <TData extends MRT_RowData>(
  definedTableOptions: MRT_DefinedTableOptions<TData>,
): MRT_TableInstance<TData> => {
  const tableRef = useRef<MRT_TableInstance<TData> | null>(null)
  const columnDefsRef = useRef<Array<MRT_ColumnDef<TData>>>([])
  const columnPreparationDepsRef = useRef<Array<unknown> | undefined>(undefined)

  // ---------------------------------------------------------------------------
  // Initial state — the column-order default and the per-column filter-fn map
  // both need the column defs, which a feature's `getInitialState` can't see, so
  // they're computed here and flow in via `initialState` (overriding the empty
  // defaults the filter-modes feature seeds).
  // ---------------------------------------------------------------------------
  const initialState = useMemo<Partial<MRT_TableState<TData>>>(() => {
    const initState = definedTableOptions.initialState ?? {}

    const columnFilterFns: MRT_ColumnFilterFnsState = {
      ...initState.columnFilterFns,
    }
    for (const col of getAllLeafColumnDefs(
      definedTableOptions.columns as Array<MRT_ColumnDef<TData>>,
    )) {
      const id = getColumnId(col)
      if (columnFilterFns[id] == null) {
        columnFilterFns[id] =
          col.filterFn instanceof Function
            ? (col.filterFn.name ?? 'custom')
            : (col.filterFn ?? getDefaultColumnFilterFn(col))
      }
    }
    initState.columnFilterFns = columnFilterFns

    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as MRT_StatefulTableOptions<TData>)
    // Core's `globalFilterFn` option also admits a raw `FilterFn`; MRT's state
    // slice only stores the string fn name, so narrow it here.
    initState.globalFilterFn =
      typeof definedTableOptions.globalFilterFn === 'string'
        ? definedTableOptions.globalFilterFn
        : 'fuzzy'
    return initState
  }, [])

  // `initialState` is readonly on the resolved core options type; assign through
  // a cast (the hook owns this options object).
  ;(
    definedTableOptions as { initialState?: Partial<MRT_TableState<TData>> }
  ).initialState = initialState

  // ---------------------------------------------------------------------------
  // State used only for the option-time transforms below (display-column
  // injection, the resize/drag column freeze, skeleton data). It's sourced from
  // the previous render's `table.state` (the full-state selector re-renders this
  // hook on every change) and falls back to initial state on the first render.
  // It is NOT passed to `useTable` as controlled `state` — only the client's own
  // `state` option controls slices; everything else is owned by core/feature
  // base atoms.
  // ---------------------------------------------------------------------------
  const transformStateDefaults = {
    columnOrder: [],
    columnResizing: {},
    creatingRow: null,
    draggingColumn: null,
    draggingRow: null,
    grouping: [],
    isLoading: false,
    pagination: { pageIndex: 0, pageSize: 10 },
    showSkeletons: false,
  }
  const stateForTransforms = {
    ...transformStateDefaults,
    ...initialState,
    ...definedTableOptions.state,
    ...(tableRef.current?.state ?? {}),
  } as MRT_TableState<TData>

  const optionsForTransforms = {
    ...definedTableOptions,
    state: stateForTransforms,
  } as MRT_StatefulTableOptions<TData>

  // Column preparation mutates/augments definitions and must rerun when an
  // input that affects those definitions changes. Keep the resulting array
  // stable across unrelated state updates such as pagination.
  const columnPreparationDeps: Array<unknown> = [
    optionsForTransforms.columns,
    optionsForTransforms.defaultColumn,
    optionsForTransforms.defaultDisplayColumn,
    optionsForTransforms.displayColumnDefOptions,
    (optionsForTransforms as any).filterFns,
    (optionsForTransforms as any).sortFns,
    optionsForTransforms.localization,
    stateForTransforms.columnFilterFns,
    stateForTransforms.creatingRow,
    stateForTransforms.grouping,
    optionsForTransforms.createDisplayMode,
    optionsForTransforms.editDisplayMode,
    optionsForTransforms.enableEditing,
    optionsForTransforms.enableExpandAll,
    optionsForTransforms.enableExpanding,
    optionsForTransforms.enableGrouping,
    optionsForTransforms.enableMultiRowSelection,
    optionsForTransforms.enableRowActions,
    optionsForTransforms.enableRowDragging,
    optionsForTransforms.enableRowNumbers,
    optionsForTransforms.enableRowOrdering,
    optionsForTransforms.enableRowPinning,
    optionsForTransforms.enableRowSelection,
    optionsForTransforms.enableSelectAll,
    optionsForTransforms.groupedColumnMode,
    optionsForTransforms.layoutMode,
    optionsForTransforms.positionExpandColumn,
    optionsForTransforms.renderDetailPanel,
    optionsForTransforms.rowNumberDisplayMode,
    optionsForTransforms.rowPinningDisplayMode,
  ]
  const previousColumnPreparationDeps = columnPreparationDepsRef.current
  const columnPreparationChanged =
    !previousColumnPreparationDeps ||
    columnPreparationDeps.length !== previousColumnPreparationDeps.length ||
    columnPreparationDeps.some(
      (dependency, index) =>
        !Object.is(dependency, previousColumnPreparationDeps[index]),
    )
  const freezePreparedColumns =
    !!columnDefsRef.current.length &&
    (stateForTransforms.columnResizing.isResizingColumn ||
      !!stateForTransforms.draggingColumn ||
      !!stateForTransforms.draggingRow)

  if (columnPreparationChanged && !freezePreparedColumns) {
    columnDefsRef.current = prepareColumns({
      columnDefs: [
        ...([
          showRowPinningColumn(optionsForTransforms) &&
            getMRT_RowPinningColumnDef(optionsForTransforms),
          showRowDragColumn(optionsForTransforms) &&
            getMRT_RowDragColumnDef(optionsForTransforms),
          showRowActionsColumn(optionsForTransforms) &&
            getMRT_RowActionsColumnDef(optionsForTransforms),
          showRowExpandColumn(optionsForTransforms) &&
            getMRT_RowExpandColumnDef(optionsForTransforms),
          showRowSelectionColumn(optionsForTransforms) &&
            getMRT_RowSelectColumnDef(optionsForTransforms),
          showRowNumbersColumn(optionsForTransforms) &&
            getMRT_RowNumbersColumnDef(optionsForTransforms),
        ].filter(Boolean) as Array<MRT_ColumnDef<TData>>),
        ...optionsForTransforms.columns,
        ...([
          showRowSpacerColumn(optionsForTransforms) &&
            getMRT_RowSpacerColumnDef(optionsForTransforms),
        ].filter(Boolean) as Array<MRT_ColumnDef<TData>>),
      ],
      tableOptions: optionsForTransforms,
    })
    columnPreparationDepsRef.current = columnPreparationDeps
  }
  const preparedColumns = columnDefsRef.current

  // If loading with empty data, generate blank rows to show skeleton loaders.
  const data = useMemo(
    () =>
      (stateForTransforms.isLoading || stateForTransforms.showSkeletons) &&
      !definedTableOptions.data.length
        ? [
            ...Array(Math.min(stateForTransforms.pagination.pageSize, 20)).fill(
              null,
            ),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(preparedColumns).map((col) => ({
                [getColumnId(col)]: null,
              })),
            ),
          )
        : definedTableOptions.data,
    [
      definedTableOptions.data,
      stateForTransforms.isLoading,
      stateForTransforms.showSkeletons,
    ],
  )

  // `useAppTable` (from `createTableHook`) owns the `mrtFeatures` bundle and
  // attaches the App* context wrappers. MRT's option-time transforms above are
  // applied before handing the options over, and the previous render's
  // `table.state` (via the full-state selector) feeds the next render's
  // transforms through `tableRef`.
  const table = useAppTable(
    {
      ...(definedTableOptions as any),
      columns: preparedColumns,
      data,
      initialState,
      globalFilterFn: (stateForTransforms.globalFilterFn ?? 'fuzzy') as any,
    },
    (state) => state, // full-state selector; MRT reads table.state.X synchronously
  ) as unknown as MRT_TableInstance<TData>

  tableRef.current = table

  useMRT_Effects(table)

  return table
}
