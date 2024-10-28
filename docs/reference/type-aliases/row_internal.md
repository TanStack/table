---
id: Row_Internal
title: Row_Internal
---

# Type Alias: Row\_Internal\<TFeatures, TData\>

```ts
type Row_Internal<TFeatures, TData>: Row_Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[types/Row.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Row.ts#L32)
