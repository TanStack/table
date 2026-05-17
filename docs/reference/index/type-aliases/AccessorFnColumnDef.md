---
id: AccessorFnColumnDef
title: AccessorFnColumnDef
---

# Type Alias: AccessorFnColumnDef\<TFeatures, TData, TValue\>

```ts
type AccessorFnColumnDef<TFeatures, TData, TValue> = AccessorFnColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

Defined in: [types/ColumnDef.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L209)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
