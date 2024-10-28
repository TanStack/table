---
id: ColumnDef
title: ColumnDef
---

# Type Alias: ColumnDef\<TFeatures, TData, TValue\>

```ts
type ColumnDef<TFeatures, TData, TValue>: DisplayColumnDef<TFeatures, TData, TValue> | GroupColumnDef<TFeatures, TData, TValue> | AccessorColumnDef<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L180)
