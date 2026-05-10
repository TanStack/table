---
id: ColumnDef
title: ColumnDef
---

# Type Alias: ColumnDef\<TFeatures, TData, TValue\>

```ts
type ColumnDef<TFeatures, TData, TValue> = 
  | DisplayColumnDef<TFeatures, TData, TValue>
  | GroupColumnDef<TFeatures, TData, TValue>
| AccessorColumnDef<TFeatures, TData, TValue>;
```

Defined in: [types/ColumnDef.ts:202](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L202)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
