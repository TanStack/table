---
id: useLegacyTable
title: useLegacyTable
---

# ~~Function: useLegacyTable()~~

```ts
function useLegacyTable<TData>(options): LegacyReactTable<TData>;
```

Defined in: [useLegacyTable.ts:365](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L365)

## Type Parameters

### TData

`TData` *extends* `RowData`

## Parameters

### options

[`LegacyTableOptions`](../type-aliases/LegacyTableOptions.md)\<`TData`\>

Legacy v8-style table options

## Returns

[`LegacyReactTable`](../type-aliases/LegacyReactTable.md)\<`TData`\>

A table instance with the full state subscribed and a `getState()` method

## Deprecated

This hook is provided as a compatibility layer for migrating from TanStack Table v8.

Use the new `useTable` hook instead with explicit `_features` and `_rowModels`:

```tsx
// New v9 API
const _features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

const table = useTable({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

Key differences from v8:
- Features are tree-shakeable - only import what you use
- Row models are explicitly passed via `_rowModels`
- Use `table.Subscribe` for fine-grained re-renders
- State is accessed via `table.state` after selecting with the 2nd argument
