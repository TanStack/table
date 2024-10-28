---
id: DisplayColumnDef
title: DisplayColumnDef
---

# Type Alias: DisplayColumnDef\<TFeatures, TData, TValue\>

```ts
type DisplayColumnDef<TFeatures, TData, TValue>: ColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L120)
