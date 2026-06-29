# v8 → v9 Mapping Tables — Full Reference

Mechanical translation tables and detailed renames for the Angular Table v8 →
v9 migration. The SKILL.md keeps the primary patterns; this file is the
exhaustive lookup.

---

## Row-model migration table

Row-model factories and fn registries are now **slots on the `features` object**,
not a separate `rowModels` option. Factory calls no longer take fn arguments;
pass the fn map as a sibling slot instead.

| v8 option                  | v9 `features` slot key | v9 factory call               | v9 fn registry slot |
| -------------------------- | ---------------------- | ----------------------------- | ------------------- |
| `getCoreRowModel()`        | (automatic)            | —                             | —                   |
| `getFilteredRowModel()`    | `filteredRowModel`     | `createFilteredRowModel()`    | `filterFns`         |
| `getSortedRowModel()`      | `sortedRowModel`       | `createSortedRowModel()`      | `sortFns`           |
| `getPaginationRowModel()`  | `paginatedRowModel`    | `createPaginatedRowModel()`   | —                   |
| `getExpandedRowModel()`    | `expandedRowModel`     | `createExpandedRowModel()`    | —                   |
| `getGroupedRowModel()`     | `groupedRowModel`      | `createGroupedRowModel()`     | `aggregationFns`    |
| `getFacetedRowModel()`     | `facetedRowModel`      | `createFacetedRowModel()`     | —                   |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues`  | `createFacetedMinMaxValues()` | —                   |
| `getFacetedUniqueValues()` | `facetedUniqueValues`  | `createFacetedUniqueValues()` | —                   |

## Feature registration table

| v8 (implicit)   | v9 feature import         |
| --------------- | ------------------------- |
| filter columns  | `columnFilteringFeature`  |
| global filter   | `globalFilteringFeature`  |
| sort rows       | `rowSortingFeature`       |
| pagination      | `rowPaginationFeature`    |
| row selection   | `rowSelectionFeature`     |
| expanding rows  | `rowExpandingFeature`     |
| pin rows        | `rowPinningFeature`       |
| pin columns     | `columnPinningFeature`    |
| hide columns    | `columnVisibilityFeature` |
| reorder columns | `columnOrderingFeature`   |
| size columns    | `columnSizingFeature`     |
| resize columns  | `columnResizingFeature`   |
| group columns   | `columnGroupingFeature`   |
| facet columns   | `columnFacetingFeature`   |

> If you don't want to think about tree-shaking yet, you can pass
> `stockFeatures`:
>
> ```ts
> import { stockFeatures } from '@tanstack/angular-table'
> features: stockFeatures
> ```
>
> This restores v8-like "everything bundled" behavior — but the v9 bundle
> wins are gone. Plan to migrate to a curated `tableFeatures({...})` as part of
> productionization.

---

## Type generics — every type takes `TFeatures` now

```txt
v8                                  v9
---                                 ---
Column<TData>                      → Column<TFeatures, TData, TValue>
ColumnDef<TData>                   → ColumnDef<TFeatures, TData, TValue>
Table<TData>                       → Table<TFeatures, TData>
Row<TData>                         → Row<TFeatures, TData>
Cell<TData, TValue>                → Cell<TFeatures, TData, TValue>
Header<TData, TValue>              → Header<TFeatures, TData, TValue>
HeaderContext<TData, TValue>       → HeaderContext<TFeatures, TData, TValue>
CellContext<TData, TValue>         → CellContext<TFeatures, TData, TValue>
```

Easiest fix: extract `typeof features` once.

```ts
const features = tableFeatures({ rowSortingFeature, columnFilteringFeature })

type Features = typeof features

const columns: Array<ColumnDef<Features, Person>> = [
  /* … */
]
```

If you're on `stockFeatures`:

```ts
import type { StockFeatures, ColumnDef } from '@tanstack/angular-table'
const columns: Array<ColumnDef<StockFeatures, Person>> = [
  /* … */
]
```

`ColumnMeta` module augmentation also needs `TFeatures`:

```ts
declare module '@tanstack/angular-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue,
  > {
    align?: 'left' | 'right'
  }
}
```

---

## Naming renames — sorting

| v8                                  | v9                       |
| ----------------------------------- | ------------------------ |
| `sortingFn` (column-def field)      | `sortFn`                 |
| `column.getSortingFn()`             | `column.getSortFn()`     |
| `column.getAutoSortingFn()`         | `column.getAutoSortFn()` |
| `SortingFn` type                    | `SortFn`                 |
| `SortingFns` interface              | `SortFns`                |
| `sortingFns` (built-in fn registry) | `sortFns`                |

Find-and-replace, then verify `sortFns` is a slot on `features` alongside `sortedRowModel: createSortedRowModel()`.

---

## Column sizing vs resizing — split

v8 combined sizing and resizing into one feature. v9 splits them so you can
ship only what you use.

| v8                                | v9                                                         |
| --------------------------------- | ---------------------------------------------------------- |
| `ColumnSizing` (single feature)   | `columnSizingFeature` + `columnResizingFeature` (separate) |
| `columnSizingInfo` state          | `columnResizing` state                                     |
| `setColumnSizingInfo()`           | `setColumnResizing()`                                      |
| `onColumnSizingInfoChange` option | `onColumnResizingChange` option                            |

If you only render fixed-width columns and never drag-to-resize, import only
`columnSizingFeature`.

---

## Pinning option split

```ts
// v8
enablePinning: true

// v9 — explicit
enableColumnPinning: true
enableRowPinning: true
```

---

## Row API: privates promoted to public

| v8                                       | v9                                     |
| ---------------------------------------- | -------------------------------------- |
| `row._getAllCellsByColumnId()` (private) | `row.getAllCellsByColumnId()` (public) |

All other `_`-prefixed internal APIs from v8 are removed in v9 — use the
public equivalents. If you were touching `_`-prefixed members, you were on
unsupported territory; v9 forces the fix.

---

## `tableOptions(...)` — new composition helper

v9 ships `tableOptions(...)` for type-safe partial option composition. Useful
during migration if you have shared base config:

```ts
import { tableOptions, tableFeatures, rowSortingFeature } from '@tanstack/angular-table'

const baseOptions = tableOptions({
  features: tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  debugTable: isDevMode(),
})

readonly table = injectTable(() => ({
  ...baseOptions,
  columns: this.columns,
  data: this.data(),
}))
```

And for whole-app patterns, `createTableHook(...)` — see
`tanstack-table/angular/angular-rendering-directives`.

---

## `RowData` type tightened

`RowData` is now stricter (object-like; no primitives). If you had
`type Row = string`, that won't fly in v9 — wrap it in an object.

---

## Lower-severity failure modes (MEDIUM/LOW)

### Skipping `stockFeatures` cleanup later

Using `stockFeatures` is a fine migration shortcut, but it forgoes the v9
bundle wins. Once everything compiles, swap `stockFeatures` for an explicit
`tableFeatures({...})` listing only the features you use.

### Forgetting `enablePinning` is gone

`enablePinning: true` silently does nothing. Use `enableColumnPinning: true`
and/or `enableRowPinning: true`.

### Forgetting `columnSizingInfo` is gone

Replace state name `columnSizingInfo` with `columnResizing`, setter
`setColumnSizingInfo` with `setColumnResizing`, handler
`onColumnSizingInfoChange` with `onColumnResizingChange`. And add
`columnResizingFeature` to `features` if you actually need resizing.

### Single global `onStateChange` ported as a giant per-slice fan-out

In v9 each slice has its own callback. If you previously used `onStateChange`
to multiplex changes, port to the specific `on[State]Change` callbacks you
actually care about — don't recreate a megaswitch.

### Hand-rolling `TFeatures` in render-fn types

When a `cell` / `header` function signature requires `CellContext<TFeatures, TData, TValue>`,
let `createColumnHelper<typeof features, TData>()` infer it for you. Spelling
features by hand in dozens of render-fn signatures is a sign you should be
using `createAppColumnHelper` from `createTableHook`.

### Reaching for `_`-prefixed internals because the public method "doesn't exist"

The "missing" method usually means the feature isn't in `features`. Add the
feature; don't peek at internals.

### Reimplementing what the table API already does

Symptoms of v8 muscle memory carrying through:

- Manually sorting the data signal in `effect(...)` instead of
  `table.setSorting(...)` and using `table.getRowModel().rows`.
- Manually paginating the rows array instead of using `paginatedRowModel`.
- Hand-rolling `getSelectedRowModel().flatRows` from a `rowSelection` signal.

If a v8 escape hatch was needed because of a bug or missing API, check the v9
public API first — many things were added in v9.

### `ColumnMeta` augmentation without the `TFeatures` generic

The interface now takes `TFeatures` first. Old declarations get silently merged
but typed wrong.

### Importing `flexRender` as a function

There's no `flexRender(fn, ctx)` in Angular. `FlexRender` is a directive tuple
constant. Imports + template directive form is the only shape.

### Trying to share v9 atoms with v8 — incompatible

If you have a partial v8 codebase coexisting, **don't** try to bridge atoms
across the version boundary. Migrate per-component.
