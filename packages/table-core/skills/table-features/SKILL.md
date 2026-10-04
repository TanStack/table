---
name: table-features
description:
  'Add or debug Table v9 features: registration, row-model slots, prerequisites,
  sorting, filtering, pagination, selection, spanning, and column layout. Read only task-relevant
  feature references.'
metadata:
  type: core
  library: '@tanstack/table-core'
  library_version: 9.2.5
requires:
  - core
sources:
  - TanStack/table:docs/guide/row-models.md
  - TanStack/table:packages/table-core/src/types/TableFeatures.ts
  - TanStack/table:packages/table-core/src/features/stockFeatures.ts
  - TanStack/table:packages/table-core/src/core/table/constructTable.ts
  - TanStack/table:packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts
  - TanStack/table:examples/react/with-tanstack-query
  - TanStack/table:docs/framework/react/guide/column-faceting.md
  - TanStack/table:packages/table-core/src/features/column-faceting
  - TanStack/table:examples/react/filters-faceted
  - TanStack/table:docs/framework/react/guide/column-filtering.md
  - TanStack/table:packages/table-core/src/features/column-filtering
  - TanStack/table:examples/react/filters
  - TanStack/table:docs/framework/react/guide/grouping.md
  - TanStack/table:packages/table-core/src/features/column-grouping
  - TanStack/table:examples/react/grouping
  - TanStack/table:docs/framework/react/guide/column-ordering.md
  - TanStack/table:packages/table-core/src/features/column-ordering
  - TanStack/table:examples/react/column-dnd
  - TanStack/table:docs/framework/react/guide/column-pinning.md
  - TanStack/table:packages/table-core/src/features/column-pinning
  - TanStack/table:examples/react/column-pinning-sticky
  - TanStack/table:docs/framework/react/guide/column-resizing.md
  - TanStack/table:packages/table-core/src/features/column-resizing
  - TanStack/table:examples/react/column-resizing-performant
  - TanStack/table:docs/framework/react/guide/column-sizing.md
  - TanStack/table:packages/table-core/src/features/column-sizing
  - TanStack/table:examples/react/column-sizing
  - TanStack/table:docs/framework/react/guide/column-visibility.md
  - TanStack/table:packages/table-core/src/features/column-visibility
  - TanStack/table:examples/react/column-visibility
  - TanStack/table:docs/framework/react/guide/global-filtering.md
  - TanStack/table:packages/table-core/src/features/global-filtering
  - TanStack/table:docs/framework/react/guide/expanding.md
  - TanStack/table:packages/table-core/src/features/row-expanding
  - TanStack/table:examples/react/expanding
  - TanStack/table:docs/framework/react/guide/pagination.md
  - TanStack/table:packages/table-core/src/features/row-pagination
  - TanStack/table:examples/react/pagination
  - TanStack/table:docs/framework/react/guide/row-pinning.md
  - TanStack/table:packages/table-core/src/features/row-pinning
  - TanStack/table:examples/react/row-pinning
  - TanStack/table:docs/framework/react/guide/cell-selection.md
  - TanStack/table:packages/table-core/src/features/cell-selection
  - TanStack/table:examples/react/cell-selection
  - TanStack/table:docs/framework/react/guide/cell-spanning.md
  - TanStack/table:packages/table-core/src/features/cell-spanning
  - TanStack/table:examples/react/cell-spanning
  - TanStack/table:docs/framework/react/guide/row-selection.md
  - TanStack/table:packages/table-core/src/features/row-selection
  - TanStack/table:examples/react/row-selection
  - TanStack/table:docs/framework/react/guide/sorting.md
  - TanStack/table:packages/table-core/src/features/row-sorting
  - TanStack/table:examples/react/sorting
  - TanStack/table:docs/framework/react/guide/aggregation.md
  - TanStack/table:packages/table-core/src/features/row-aggregation
  - TanStack/table:examples/react/aggregation
  - TanStack/table:examples/react/grouped-aggregation
---

# Feature architecture

Read [core](../core/SKILL.md) first for the headless model and stable inputs.

## Register the behavior the table uses

<!-- skill-snippet:check -->

```ts
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

Pass the stable `features` object to the installed adapter constructor. The concrete registry determines optional APIs, options, state slices, and their types. The core row model is automatic; a custom core model uses `coreRowModel`.

## Registration rules

- Register each prerequisite feature before its dependent slot in the same `tableFeatures` call. A processing factory alone cannot install that feature's APIs or state.
- Row-model factories use `create*RowModel()` feature slots. Their names and prerequisites are in the feature reference. They take no function-registry arguments.
- `filterFns`, `sortFns`, and `aggregationFns` are feature slots, not table options. They require `columnFilteringFeature`, `rowSortingFeature`, and `rowAggregationFeature`, respectively.
- Import individual built-ins such as `sortFn_alphanumeric` and register their conventional keys. Those keys become typed string names; `'auto'` can resolve only registered functions. Pass a function directly when a column needs no named registry entry. Full registry exports bundle every built-in.
- `columnResizingFeature` requires `columnSizingFeature`; `globalFilteringFeature` requires `columnFilteringFeature`. Check installed `FeatureSlotPrereqs` for other dependencies.
- Use explicit features for normal construction. `stockFeatures` is a deliberate all-features convenience or temporary migration aid, with the corresponding bundle cost.

A missing API can mean missing registration. Check the concrete feature object before casting, recreating an API, or assuming v9 removed it.

## Select references by the requested change

Read only references needed for the requested behavior and its dependencies, including features being added. An unrelated feature already registered on the table does not make its reference necessary.

| Task involves                                                                            | Read                                                      |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Manual modes, server data, mixed row-processing stages, or dataset scope                 | [Client/server ownership](references/client-vs-server.md) |
| Totals, multiple aggregations, grouped aggregate values, or custom aggregate definitions | [Aggregation](references/aggregation.md)                  |
| Facet option counts, numeric ranges, or incomplete server facets                         | [Column faceting](references/column-faceting.md)          |
| Per-column filters, filter functions, metadata, or nested-row filtering                  | [Column filtering](references/column-filtering.md)        |
| Group rows, placeholders, or grouping with expansion/pagination                          | [Grouping](references/grouping.md)                        |
| Drag ordering or leaf-column order differing from state                                  | [Column ordering](references/column-ordering.md)          |
| Sticky column regions, logical start/end, or pinning gaps                                | [Column pinning](references/column-pinning.md)            |
| Drag resize handles, gesture events, or resize performance                               | [Column resizing](references/column-resizing.md)          |
| Numeric widths, min/max limits, or model/CSS size mismatch                               | [Column sizing](references/column-sizing.md)              |
| Hidden columns, visibility-aware rendering, or hiding controls                           | [Column visibility](references/column-visibility.md)      |
| A search across columns or global-filter eligibility                                     | [Global filtering](references/global-filtering.md)        |
| Hierarchical subrows, detail panels, or expansion/page interaction                       | [Expanding](references/expanding.md)                      |
| Page slicing, counts, navigation, or page-index resets                                   | [Pagination](references/pagination.md)                    |
| Top/bottom pinned rows or their visibility outside the current page                      | [Row pinning](references/row-pinning.md)                  |
| Rectangular cell selection, include/exclude ranges, or drag outlines                     | [Cell selection](references/cell-selection.md)            |
| Merged body cells, covered cells, or spans changing with row order                       | [Cell spanning](references/cell-spanning.md)              |
| Row checkboxes, select-all, Shift ranges, or IDs across pages                            | [Row selection](references/row-selection.md)              |
| Sorting, comparators, undefined values, or sort interaction cycles                       | [Sorting](references/sorting.md)                          |

For controlled state or reset behavior, read [shared state](../table-state/SKILL.md) and load the installed adapter's state skill for reactive wiring.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/types/TableFeatures.d.ts` for slots and `FeatureSlotPrereqs`. Follow `dist/features/<feature>/` for exact state, option, and instance declarations. Each reference names its feature directory.
