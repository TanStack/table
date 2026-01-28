---
id: LegacyTableOptions
title: LegacyTableOptions
---

# ~~Type Alias: LegacyTableOptions\<TData\>~~

```ts
type LegacyTableOptions<TData> = Omit<TableOptions<StockFeatures, TData>, "_features" | "_rowModels"> & LegacyRowModelOptions<TData>;
```

Defined in: [useLegacyTable.ts:240](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L240)

Legacy v8-style table options that work with useLegacyTable.

This type omits `_features` and `_rowModels` and instead accepts the v8-style
`get*RowModel` function options.

## Type Parameters

### TData

`TData` *extends* `RowData`

## Deprecated

This is a compatibility layer for migrating from v8. Use `useTable` with explicit `_features` and `_rowModels` instead.
