# Architecture migration mappings

Read for feature registration, factory and registry movement, method binding, or consumed v8 internals.

## Minimal v9 shape

```ts
import {
  createFilteredRowModel,
  createSortedRowModel,
  columnFilteringFeature,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

Pass `features` to the adapter's v9 table constructor. Define it statically outside render/setup work when possible.

## Register every non-core feature explicitly

V8 bundled all stock features. V9 exposes an API only when its feature is present in `tableFeatures({...})`.

| Capability                  | V9 feature                |
| --------------------------- | ------------------------- |
| Aggregation                 | `rowAggregationFeature`   |
| Cell selection              | `cellSelectionFeature`    |
| Cell spanning               | `cellSpanningFeature`     |
| Column faceting             | `columnFacetingFeature`   |
| Column filtering            | `columnFilteringFeature`  |
| Column ordering             | `columnOrderingFeature`   |
| Column pinning              | `columnPinningFeature`    |
| Column sizes and offsets    | `columnSizingFeature`     |
| Column visibility           | `columnVisibilityFeature` |
| Global filtering            | `globalFilteringFeature`  |
| Grouping                    | `columnGroupingFeature`   |
| Interactive column resizing | `columnResizingFeature`   |
| Pagination                  | `rowPaginationFeature`    |
| Row expansion               | `rowExpandingFeature`     |
| Row pinning                 | `rowPinningFeature`       |
| Row selection               | `rowSelectionFeature`     |
| Sorting                     | `rowSortingFeature`       |

The core row model and core table/row/column/header/cell behavior are automatic. `stockFeatures` restores a v8-like all-features surface, but use it as an audit shortcut rather than the default production recommendation.

Honor feature prerequisites in the same `tableFeatures` call:

- `columnResizingFeature` requires `columnSizingFeature`.
- `globalFilteringFeature` requires `columnFilteringFeature`.
- Every row-model or function-registry slot requires its associated feature.
- `aggregationFns` requires `rowAggregationFeature`; grouped aggregation uses both `rowAggregationFeature` and `columnGroupingFeature`.
- Put prerequisite feature properties before dependent slots so inference and diagnostics remain clear.

## Move row models into feature slots and rename factories

V8 `get*RowModel()` table options and the removed `rowModels` object are gone. V9 `create*RowModel()` factories take no registry arguments and are registered as named feature slots.

| V8 table option                                    | V9 `tableFeatures` slot                | V9 factory                                     |
| -------------------------------------------------- | -------------------------------------- | ---------------------------------------------- |
| `getCoreRowModel: getCoreRowModel()`               | automatic; omit for the built-in model | built-in `createCoreRowModel()` is the default |
| `getFilteredRowModel: getFilteredRowModel()`       | `filteredRowModel`                     | `createFilteredRowModel()`                     |
| `getSortedRowModel: getSortedRowModel()`           | `sortedRowModel`                       | `createSortedRowModel()`                       |
| `getPaginationRowModel: getPaginationRowModel()`   | `paginatedRowModel`                    | `createPaginatedRowModel()`                    |
| `getExpandedRowModel: getExpandedRowModel()`       | `expandedRowModel`                     | `createExpandedRowModel()`                     |
| `getGroupedRowModel: getGroupedRowModel()`         | `groupedRowModel`                      | `createGroupedRowModel()`                      |
| `getFacetedRowModel: getFacetedRowModel()`         | `facetedRowModel`                      | `createFacetedRowModel()`                      |
| `getFacetedMinMaxValues: getFacetedMinMaxValues()` | `facetedMinMaxValues`                  | `createFacetedMinMaxValues()`                  |
| `getFacetedUniqueValues: getFacetedUniqueValues()` | `facetedUniqueValues`                  | `createFacetedUniqueValues()`                  |

For a custom core model, use the `coreRowModel` slot rather than restoring the v8 table option.

Move registries from table options or factory arguments into these feature slots:

| V8               | V9               |
| ---------------- | ---------------- |
| `sortingFns`     | `sortFns`        |
| `filterFns`      | `filterFns`      |
| `aggregationFns` | `aggregationFns` |

Register only the built-ins the table references by string name, importing each individually (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`, and so on) alongside any custom functions. The full registry objects (`filterFns`, `sortFns`, `aggregationFns` exports) still work but bundle every built-in. A slot's keys become the valid string names in column definitions, and `'auto'` resolves only registered functions.

## Keep instance methods bound

Row, cell, column, header, and related object methods moved to shared prototypes. Destructuring, passing a bare callback, spreading, `Object.keys`, and `JSON.stringify` no longer preserve or reveal those methods.

```ts
// v8 code that breaks
const { getValue } = row
rows.map(row.getVisibleCells)

// v9
const value = row.getValue('name')
rows.map((row) => row.getVisibleCells())
```

Audit all methods extracted from rows, cells, columns, headers, and header groups. Table-instance methods are not subject to this specific migration rule.

## Remove internal APIs and use public surfaces

Consumed v8 underscore-prefixed internals are unsupported migration dependencies. Use public APIs rather than relying on similarly named v9 internals. Known migration points include:

| Removed v8 internal               | V9 public direction                                           |
| --------------------------------- | ------------------------------------------------------------- |
| `row._getAllCellsByColumnId()`    | `row.getAllCellsByColumnId()`                                 |
| `table._getPinnedRows()`          | `table.getTopRows()`, `getCenterRows()`, or `getBottomRows()` |
| `table._getFacetedRowModel()`     | public faceting APIs on the relevant column/table             |
| `table._getFacetedMinMaxValues()` | `getFacetedMinMaxValues()`                                    |
| `table._getFacetedUniqueValues()` | `getFacetedUniqueValues()`                                    |

For any other `_` API, do not guess. Inspect the installed v9 declarations for the public replacement or redesign the integration.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/index.d.ts`, `dist/types/TableFeatures.d.ts`, and the relevant `dist/features/` declarations. Check the installed version before replacing an absent API.

## Sources

- `TanStack/table:docs/framework/react/guide/migrating.md`
- `TanStack/table:docs/framework/preact/guide/migrating.md`
- `TanStack/table:docs/framework/solid/guide/migrating.md`
- `TanStack/table:docs/framework/svelte/guide/migrating.md`
- `TanStack/table:docs/framework/vue/guide/migrating.md`
- `TanStack/table:docs/framework/angular/guide/migrating.md`
- `TanStack/table:docs/framework/lit/guide/migrating.md`
- `TanStack/table:packages/table-core/src/index.ts`
- `TanStack/table:packages/table-core/src/types/TableFeatures.ts`
- `TanStack/table:packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts`
- `TanStack/table:packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts`
- `TanStack/table:packages/react-table/src/legacy.ts`
