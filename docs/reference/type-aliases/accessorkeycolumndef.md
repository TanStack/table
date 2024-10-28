---
id: AccessorKeyColumnDef
title: AccessorKeyColumnDef
---

# Type Alias: AccessorKeyColumnDef\<TFeatures, TData, TValue\>

```ts
type AccessorKeyColumnDef<TFeatures, TData, TValue>: AccessorKeyColumnDefBase<TFeatures, TData, TValue> & Partial<ColumnIdentifiers<TFeatures, TData, TValue>>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L165)
