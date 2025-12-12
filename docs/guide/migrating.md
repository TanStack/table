---
title: Migrating to V8 Guide
---

## Migrating to V9

### Common Breaking Changes

Here are the expected breaking changes for the most common use cases of TanStack Table of V8 to V9.

- Simplified names of hooks to be more consistent with all other TanStack Libraries.
  - `createAngularTable` -> `injectTable`
  - `createSolidTable` -> `createTable`
  - `createSvelteTable` -> `createTable`
  - `useReactTable` -> `useTable`
  - `useVueTable` -> `useTable`

> This might be the only breaking change for the most common use cases of TanStack Table!

- Removed `enablePinning` table option in favor of individual `enableColumnPinning` and `enableRowPinning` options.

### Advanced Breaking Changes

V9 of TanStack Table has a lot of internal refactoring that should not affect most use cases unless you were using internal APIs. Here are some of the advanced breaking changes:

- Removed All internal APIs that started with `_` prefix. The intended public versions of these APIs have remained unchanged.
  - Removed `table._getPinnedRows()`
  - Removed `table._getFacetedRowModel()`
  - Removed `table._getFacetedMinMaxValues()`
  - Removed `table._getFacetedUniqueValues()`
