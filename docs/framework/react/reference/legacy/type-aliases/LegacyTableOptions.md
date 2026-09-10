---
id: LegacyTableOptions
title: LegacyTableOptions
---

# ~~Type Alias: LegacyTableOptions\<TData\>~~

```ts
type LegacyTableOptions<TData> = Omit<TableOptions<LegacyFeatures, TData>, "features"> & LegacyRowModelOptions<TData>;
```

Defined in: [react-table/src/useLegacyTable.ts:279](https://github.com/TanStack/table/blob/main/packages/react-table/src/useLegacyTable.ts#L279)

Legacy v8-style table options that work with useLegacyTable.

This type omits `features` and instead accepts the v8-style
`get*RowModel` function options.

## Type Parameters

### TData

`TData` *extends* `RowData`

## Deprecated

This is a compatibility layer for migrating from v8. Use `useTable` with an explicit `features` option instead.
