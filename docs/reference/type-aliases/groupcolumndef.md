---
id: GroupColumnDef
title: GroupColumnDef
---

# Type Alias: GroupColumnDef\<TFeatures, TData, TValue\>

```ts
type GroupColumnDef<TFeatures, TData, TValue>: GroupColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L134)
