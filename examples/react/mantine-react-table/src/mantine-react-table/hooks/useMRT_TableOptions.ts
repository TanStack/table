import { useMemo } from 'react'

import {
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  stockFeatures,
} from '@tanstack/react-table'

import { useDirection } from '@mantine/core'

import { MRT_AggregationFns } from '../fns/aggregationFns'
import { MRT_FilterFns } from '../fns/filterFns'
import { MRT_SortFns } from '../fns/sortingFns'
import { MRT_Default_Icons } from '../icons'
import { MRT_Localization_EN } from '../locales/en'
import type {
  MRT_DefinedTableOptions,
  MRT_RowData,
  MRT_TableOptions,
} from '../types'

export const MRT_DefaultColumn = {
  filterVariant: 'text',
  maxSize: 1000,
  minSize: 40,
  size: 180,
} as const

export const MRT_DefaultDisplayColumn = {
  columnDefType: 'display',
  enableClickToCopy: false,
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnFilter: false,
  enableColumnOrdering: false,
  enableEditing: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableResizing: false,
  enableSorting: false,
} as const

export const useMRT_TableOptions: <TData extends MRT_RowData>(
  tableOptions: MRT_TableOptions<TData>,
) => MRT_DefinedTableOptions<TData> = <TData extends MRT_RowData>({
  aggregationFns,
  autoResetExpanded = false,
  columnFilterDisplayMode = 'subheader',
  columnResizeDirection,
  columnResizeMode = 'onChange',
  createDisplayMode = 'modal',
  defaultColumn,
  defaultDisplayColumn,
  editDisplayMode = 'modal',
  enableBatchRowSelection = true,
  enableBottomToolbar = true,
  enableColumnActions = true,
  enableColumnFilters = true,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  enableColumnResizing = false,
  enableColumnVirtualization,
  enableDensityToggle = true,
  enableExpandAll = true,
  enableExpanding,
  enableFacetedValues = false,
  enableFilterMatchHighlighting = true,
  enableFilters = true,
  enableFullScreenToggle = true,
  enableGlobalFilter = true,
  enableGlobalFilterRankedResults = true,
  enableGrouping = false,
  enableHeaderActionsHoverReveal = false,
  enableHiding = true,
  enableMultiRowSelection = true,
  enableMultiSort = true,
  enablePagination = true,
  enableRowPinning = false,
  enableRowSelection = false,
  enableRowVirtualization,
  enableSelectAll = true,
  enableSorting = true,
  enableStickyHeader = false,
  enableTableFooter = true,
  enableTableHead = true,
  enableToolbarInternalActions = true,
  enableTopToolbar = true,
  filterFns,
  icons,
  layoutMode,
  localization,
  manualFiltering,
  manualGrouping,
  manualPagination,
  manualSorting,
  paginationDisplayMode = 'default',
  positionActionsColumn = 'first',
  positionCreatingRow = 'top',
  positionExpandColumn = 'first',
  positionGlobalFilter = 'right',
  positionPagination = 'bottom',
  positionToolbarAlertBanner = 'top',
  positionToolbarDropZone = 'top',
  rowNumberDisplayMode = 'static',
  rowPinningDisplayMode = 'sticky',
  selectAllMode = 'page',
  sortFns,
  ...rest
}: MRT_TableOptions<TData>) => {
  const direction = useDirection()

  icons = useMemo(() => ({ ...MRT_Default_Icons, ...icons }), [icons])
  localization = useMemo(
    () => ({
      ...MRT_Localization_EN,
      ...localization,
    }),
    [localization],
  )
  aggregationFns = useMemo(
    () => ({ ...MRT_AggregationFns, ...aggregationFns }),
    [],
  )
  filterFns = useMemo(
    () => ({ ...MRT_FilterFns, ...filterFns }) as typeof filterFns,
    [],
  )
  sortFns = useMemo(() => ({ ...MRT_SortFns, ...sortFns }), [])
  defaultColumn = useMemo(
    () => ({ ...MRT_DefaultColumn, ...defaultColumn }),
    [defaultColumn],
  )
  defaultDisplayColumn = useMemo(
    () => ({
      ...MRT_DefaultDisplayColumn,
      ...defaultDisplayColumn,
    }),
    [defaultDisplayColumn],
  )
  // cannot be changed after initialization
  ;[enableColumnVirtualization, enableRowVirtualization] = useMemo(
    () => [enableColumnVirtualization, enableRowVirtualization],
    [],
  )

  if (!columnResizeDirection) {
    columnResizeDirection = direction.dir || 'ltr'
  }

  layoutMode =
    layoutMode || (enableColumnResizing ? 'grid-no-grow' : 'semantic')
  if (
    layoutMode === 'semantic' &&
    (enableRowVirtualization || enableColumnVirtualization)
  ) {
    layoutMode = 'grid'
  }

  if (enableRowVirtualization) {
    enableStickyHeader = true
  }

  if (enablePagination === false && manualPagination === undefined) {
    manualPagination = true
  }

  if (!rest.data?.length) {
    manualFiltering = true
    manualGrouping = true
    manualPagination = true
    manualSorting = true
  }

  return {
    aggregationFns,
    autoResetExpanded,
    columnFilterDisplayMode,
    columnResizeDirection,
    columnResizeMode,
    createDisplayMode,
    defaultColumn,
    defaultDisplayColumn,
    editDisplayMode,
    enableBatchRowSelection,
    enableBottomToolbar,
    enableColumnActions,
    enableColumnFilters,
    enableColumnOrdering,
    enableColumnPinning,
    enableColumnResizing,
    enableColumnVirtualization,
    enableDensityToggle,
    enableExpandAll,
    enableExpanding,
    enableFacetedValues,
    enableFilterMatchHighlighting,
    enableFilters,
    enableFullScreenToggle,
    enableGlobalFilter,
    enableGlobalFilterRankedResults,
    enableGrouping,
    enableHeaderActionsHoverReveal,
    enableHiding,
    enableMultiRowSelection,
    enableMultiSort,
    enablePagination,
    enableRowPinning,
    enableRowSelection,
    enableRowVirtualization,
    enableSelectAll,
    enableSorting,
    enableStickyHeader,
    enableTableFooter,
    enableTableHead,
    enableToolbarInternalActions,
    enableTopToolbar,
    filterFns,
    _features: stockFeatures,
    _rowModels: {
      ...((enableColumnFilters || enableGlobalFilter || enableFilters) &&
      !manualFiltering
        ? { filteredRowModel: createFilteredRowModel(filterFns as any) }
        : {}),
      ...(enableSorting && !manualSorting
        ? { sortedRowModel: createSortedRowModel(sortFns as any) }
        : {}),
      ...(enablePagination && !manualPagination
        ? { paginatedRowModel: createPaginatedRowModel() }
        : {}),
      ...(enableExpanding || enableGrouping
        ? { expandedRowModel: createExpandedRowModel() }
        : {}),
      ...(enableGrouping && !manualGrouping
        ? { groupedRowModel: createGroupedRowModel(aggregationFns as any) }
        : {}),
      ...(enableFacetedValues
        ? {
            facetedRowModel: createFacetedRowModel(),
            facetedMinMaxValues: createFacetedMinMaxValues(),
            facetedUniqueValues: createFacetedUniqueValues(),
          }
        : {}),
    },
    getSubRows: (row: TData) => (row as any)?.subRows,
    icons,
    layoutMode,
    localization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    paginationDisplayMode,
    positionActionsColumn,
    positionCreatingRow,
    positionExpandColumn,
    positionGlobalFilter,
    positionPagination,
    positionToolbarAlertBanner,
    positionToolbarDropZone,
    rowNumberDisplayMode,
    rowPinningDisplayMode,
    selectAllMode,
    sortFns,
    ...rest,
  } as MRT_DefinedTableOptions<TData>
}
