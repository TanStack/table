---
id: AccessorFnColumnDef
title: AccessorFnColumnDef
---

# Type Alias: AccessorFnColumnDef\<TFeatures, TData, TValue\>

```ts
type AccessorFnColumnDef<TFeatures, TData, TValue>: AccessorFnColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L149)
