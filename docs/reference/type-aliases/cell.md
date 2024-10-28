---
id: Cell
title: Cell
---

# Type Alias: Cell\<TFeatures, TData, TValue\>

```ts
type Cell<TFeatures, TData, TValue>: Cell_Cell<TFeatures, TData, TValue> & UnionToIntersection<"ColumnGrouping" extends keyof TFeatures ? Cell_ColumnGrouping : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/Cell.ts:6](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Cell.ts#L6)
