---
id: ExtractColumnMeta
title: ExtractColumnMeta
---

# Type Alias: ExtractColumnMeta\<TFeatures, TData, TValue\>

```ts
type ExtractColumnMeta<TFeatures, TData, TValue> = IsAny<TFeatures> extends true ? ColumnMeta<TFeatures, TData, TValue> : TFeatures extends object ? TMeta : ColumnMeta<TFeatures, TData, TValue>;
```

Defined in: [types/ColumnDef.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L32)

Resolves the type of `columnDef.meta` for a feature set.

When the features object declares a `columnMeta` type-only slot
(`tableFeatures({ ..., columnMeta: {} as MyColumnMeta })`), that type wins.
Otherwise this falls back to the global declaration-merged `ColumnMeta`
interface.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
