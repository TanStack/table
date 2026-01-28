---
id: AccessorFnColumnDef
title: AccessorFnColumnDef
---

# Type Alias: AccessorFnColumnDef\<TFeatures, TData, TValue\>

```ts
type AccessorFnColumnDef<TFeatures, TData, TValue> = AccessorFnColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:171](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L171)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
