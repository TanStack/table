---
id: ExtractTableMeta
title: ExtractTableMeta
---

# Type Alias: ExtractTableMeta\<TFeatures, TData\>

```ts
type ExtractTableMeta<TFeatures, TData> = IsAny<TFeatures> extends true ? TableMeta<TFeatures, TData> : TFeatures extends object ? TMeta : TableMeta<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.types.ts#L28)

Resolves the type of `options.meta` for a feature set.

When the features object declares a `tableMeta` type-only slot
(`tableFeatures({ ..., tableMeta: {} as MyTableMeta })`), that type wins.
Otherwise this falls back to the global declaration-merged `TableMeta`
interface.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
