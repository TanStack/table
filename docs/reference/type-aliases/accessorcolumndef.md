---
id: AccessorColumnDef
title: AccessorColumnDef
---

# Type Alias: AccessorColumnDef\<TFeatures, TData, TValue\>

```ts
type AccessorColumnDef<TFeatures, TData, TValue>: AccessorKeyColumnDef<TFeatures, TData, TValue> | AccessorFnColumnDef<TFeatures, TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L172)
