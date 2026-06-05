---
id: LegacyTableOptions
title: LegacyTableOptions
---

# ~~Type Alias: LegacyTableOptions\<TData\>~~

```ts
type LegacyTableOptions<TData> = Omit<TableOptions<StockFeatures, TData>, "features" | "rowModels"> & LegacyRowModelOptions<TData>;
```

Defined in: [useLegacyTable.ts:264](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L264)

Legacy v8-style table options that work with useLegacyTable.

This type omits `features` and `rowModels` and instead accepts the v8-style
`get*RowModel` function options.

## Type Parameters

### TData

`TData` *extends* `RowData`

## Deprecated

This is a compatibility layer for migrating from v8. Use `useTable` with explicit `features` and `rowModels` instead.
