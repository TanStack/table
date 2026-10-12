# @tanstack/table-devtools

## 9.2.8

### Patch Changes

- [#6623](https://github.com/TanStack/table/pull/6623) [`f1c3409`](https://github.com/TanStack/table/commit/f1c3409bb4aae6c07ebb1cb0a0723372ed64223e) - Improve tree-shaking. Importing one built-in `filterFn_*`, `sortFn_*`, or `aggregationFn_*` now bundles only that function instead of its whole module. The core row model, header building, and the filtered, sorted, and grouped row models no longer import code from features a table doesn't register, so a minimal table is about 0.6 kB (brotli) smaller and grouping without `rowAggregationFeature` no longer bundles the aggregation executor. Add `table.autoResetSorting()`, and fix the `Table_RowPagination` type to declare the `autoResetPageIndex` method the table actually has (it was typed as `_autoResetPageIndex`).

  The devtools Features panel now shows measured minified + brotli sizes for every feature, row model, and built-in function, and its total accounts for code that features share.

## 9.2.5

### Patch Changes

- [#6609](https://github.com/TanStack/table/pull/6609) [`e9158e7`](https://github.com/TanStack/table/commit/e9158e7be837525ab99abd78550266d7cdcc58b2) - Update TanStack Store dependencies to the latest compatible patch releases.

## 9.2.0

### Minor Changes

- [#6553](https://github.com/TanStack/table/pull/6553) [`faa261b`](https://github.com/TanStack/table/commit/faa261b54c00ab4758861c1903bfce70a158f1c6) - Support the latest `@tanstack/devtools` by flattening nested plugin theme props and skipping broken Devtools UI font URLs under Angular Vite.

## 9.1.2

## 9.1.1

## 9.1.0

## 9.0.1

### Patch Changes

- [#6516](https://github.com/TanStack/table/pull/6516) [`2d5d6c5`](https://github.com/TanStack/table/commit/2d5d6c580c799d54ac9789c757c49bebd23f99cc) - Hotfix: Fixes TableDevtoolsPanel rendering while using as a standalone component in TanStack Devtools

## 9.0.0

### Major Changes

- [#6512](https://github.com/TanStack/table/pull/6512) [`2327f80`](https://github.com/TanStack/table/commit/2327f80906bebbfef5766cebf556d195952f459e) - TanStack Table v9 stable release. See the "Migrating to V9" guide for your framework (e.g. [React](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)) for upgrade instructions.
