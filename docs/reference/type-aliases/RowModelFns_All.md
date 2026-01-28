---
id: RowModelFns_All
title: RowModelFns_All
---

# Type Alias: RowModelFns\_All\<TFeatures, TData\>

```ts
type RowModelFns_All<TFeatures, TData> = Partial<RowModelFns_ColumnFiltering<TFeatures, TData> & RowModelFns_ColumnGrouping<TFeatures, TData> & RowModelFns_RowSorting<TFeatures, TData>>;
```

Defined in: [packages/table-core/src/types/RowModelFns.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModelFns.ts#L44)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
