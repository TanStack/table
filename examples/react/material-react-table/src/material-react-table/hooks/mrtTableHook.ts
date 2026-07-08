import { createTableHook } from '@tanstack/react-table'
import { mrtFeatures } from '../features/mrtFeatures'
import type { MRT_RowData, MRT_TableInstance } from '../types'

/**
 * The MRT table hook, built on TanStack's `createTableHook`. It binds the
 * static `mrtFeatures` bundle once and hands back:
 *
 * - `useAppTable` — constructs the table and attaches the `AppTable` / `AppCell`
 *   / `AppHeader` context-provider wrappers plus any registered `tableComponents`.
 *   `useMRT_TableInstance` wraps this with MRT's option-time transforms.
 * - `useTableContext` / `useCellContext` / `useHeaderContext` — let MRT
 *   components read the table / cell / header from React context instead of
 *   threading a `table` prop through every component.
 * - `createAppColumnHelper` — a column helper pre-bound to `mrtFeatures`.
 *
 * Component registries are intentionally empty for now; components are migrated
 * onto the context hooks incrementally and registered here as they land.
 */
export const {
  useAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
  createAppColumnHelper,
} = createTableHook({
  features: mrtFeatures,
  tableComponents: {},
  cellComponents: {},
  headerComponents: {},
})

/**
 * Reads the current table from context (provided by `<table.AppTable>`), typed
 * as `MRT_TableInstance<TData>` so every MRT component keeps its existing
 * `table.state.X` / `table.options.X` / `table.setX` typing.
 *
 * This is the single seam MRT components use instead of a threaded `table`
 * prop. `useTableContext` returns the core-typed extended instance; the cast
 * re-applies MRT's wrapper types (the `MRT_*` return-type retypings that don't
 * live on the feature maps yet). Phase 3 removes the wrapper and this cast
 * becomes an identity.
 */
export function useMRTContext<
  TData extends MRT_RowData = MRT_RowData,
>(): MRT_TableInstance<TData> {
  return useTableContext() as unknown as MRT_TableInstance<TData>
}
