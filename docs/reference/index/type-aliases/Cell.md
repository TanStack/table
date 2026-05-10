---
id: Cell
title: Cell
---

# Type Alias: Cell\<TFeatures, TData, TValue\>

```ts
type Cell<TFeatures, TData, TValue> = Cell_Cell<TFeatures, TData, TValue> & UnionToIntersection<"columnGroupingFeature" extends keyof TFeatures ? Cell_ColumnGrouping : never> & ExtractFeatureTypes<"Cell", TFeatures> & Cell_Plugins<TFeatures, TData, TValue>;
```

Defined in: [types/Cell.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Cell.ts#L22)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
