---
id: Cell
title: Cell
---

# Type Alias: Cell\<TFeatures, TData, TValue\>

```ts
type Cell<TFeatures, TData, TValue> = Cell_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap>;
```

Defined in: [types/Cell.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Cell.ts#L16)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
