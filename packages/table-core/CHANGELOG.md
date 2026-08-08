# @tanstack/table-core

## 9.1.1

### Patch Changes

- [#6529](https://github.com/TanStack/table/pull/6529) [`269e0d8`](https://github.com/TanStack/table/commit/269e0d81c8b5c128de01cbab4ddb40240a4b8b38) - Fix `getSortedRowModel().flatRows` listing sub-rows before their parent. This restores the parent-first order used by the v8 sorted model and aligns the flattened result with the sorted `rows` tree, core row model, and paginated row model.

## 9.1.0

### Minor Changes

- [#6526](https://github.com/TanStack/table/pull/6526) [`09598d2`](https://github.com/TanStack/table/commit/09598d2e413fe63396d183a8a4fc145c31c6d2ea) - Support `Infinity` as a page size and add `getCanLastPage` for detecting whether a finite last page can be reached.

## 9.0.1

## 9.0.0

### Major Changes

- [#6512](https://github.com/TanStack/table/pull/6512) [`2327f80`](https://github.com/TanStack/table/commit/2327f80906bebbfef5766cebf556d195952f459e) - TanStack Table v9 stable release. See the "Migrating to V9" guide for your framework (e.g. [React](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)) for upgrade instructions.
