import {
  createCoreRowModel,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  stockFeatures,
  tableFeatures,
} from '@tanstack/react-table'
import { MRT_AggregationFns } from '../fns/aggregationFns'
import { MRT_FilterFns } from '../fns/filterFns'
import { MRT_SortFns } from '../fns/sortingFns'
import { mrtCellActionsFeature } from './mrtCellActionsFeature'
import { mrtColumnDraggingFeature } from './mrtColumnDraggingFeature'
import { mrtConfigFeature } from './mrtConfigFeature'
import { mrtDensityFeature } from './mrtDensityFeature'
import { mrtEditingFeature } from './mrtEditingFeature'
import { mrtFilterModesFeature } from './mrtFilterModesFeature'
import { mrtFullScreenFeature } from './mrtFullScreenFeature'
import { mrtLoadingFeature } from './mrtLoadingFeature'
import { mrtRefsFeature } from './mrtRefsFeature'
import { mrtRowDraggingFeature } from './mrtRowDraggingFeature'
import { mrtToolbarsFeature } from './mrtToolbarsFeature'

/**
 * The complete, static feature registry for Material React Table.
 *
 * Every stock feature plus every MRT custom feature is included unconditionally.
 * Row models are runtime-gated by the `manual*` options (see
 * `coreRowModelsFeature.utils`), so a client that disables a feature simply runs
 * that model over empty state (an identity pass) — the same result MRT's old
 * conditional feature assembly produced, without rebuilding `features` per table.
 *
 * The `filterFns` / `sortFns` / `aggregationFns` registries here supply the
 * built-in named functions and their string-name types. Client-supplied custom
 * functions (`options.filterFns` etc.) are merged over these at construction
 * time in `useMRT_TableInstance`.
 */
export const mrtFeatures = tableFeatures({
  ...stockFeatures,
  mrtCellActionsFeature,
  mrtColumnDraggingFeature,
  mrtConfigFeature,
  mrtDensityFeature,
  mrtEditingFeature,
  mrtFilterModesFeature,
  mrtFullScreenFeature,
  mrtLoadingFeature,
  mrtRefsFeature,
  mrtRowDraggingFeature,
  mrtToolbarsFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  // These MRT fn registries are authored against `Row<StockFeatures>`, which is
  // invariant against the `Row<any, any>` the feature slot expects, so they're
  // cast here. Named-function string typing still flows through `MRT_FilterOption`
  // / `MRT_SortingOption` / `MRT_AggregationOption` (derived from `typeof` each
  // registry), so nothing downstream loses inference.
  filterFns: MRT_FilterFns as any,
  sortFns: MRT_SortFns as any,
  aggregationFns: MRT_AggregationFns as any,
})

export type MRT_Features = typeof mrtFeatures
