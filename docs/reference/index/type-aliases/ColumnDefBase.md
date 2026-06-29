---
id: ColumnDefBase
title: ColumnDefBase
---

# Type Alias: ColumnDefBase\<TFeatures, TData, TValue\>

```ts
type ColumnDefBase<TFeatures, TData, TValue> = ColumnDefBase_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, ColumnDef_FeatureMap<TFeatures, TData, TValue>>;
```

Defined in: [types/ColumnDef.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L144)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
