---
id: _Cell
title: _Cell
---

# Type Alias: \_Cell\<TFeatures, TData, TValue\>

```ts
type _Cell<TFeatures, TData, TValue>: Cell_Cell<TFeatures, TData, TValue> & UnionToIntersection<"ColumnGrouping" extends keyof TFeatures ? Cell_ColumnGrouping : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/Cell.ts:6](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/Cell.ts#L6)
