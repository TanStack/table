---
id: GroupColumnDef
title: GroupColumnDef
---

# Type Alias: GroupColumnDef\<TFeatures, TData, TValue\>

```ts
type GroupColumnDef<TFeatures, TData, TValue>: GroupColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:121](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/ColumnDef.ts#L121)
