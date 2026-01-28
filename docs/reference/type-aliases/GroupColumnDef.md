---
id: GroupColumnDef
title: GroupColumnDef
---

# Type Alias: GroupColumnDef\<TFeatures, TData, TValue\>

```ts
type GroupColumnDef<TFeatures, TData, TValue> = GroupColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L156)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
