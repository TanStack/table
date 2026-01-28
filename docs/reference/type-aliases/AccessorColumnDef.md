---
id: AccessorColumnDef
title: AccessorColumnDef
---

# Type Alias: AccessorColumnDef\<TFeatures, TData, TValue\>

```ts
type AccessorColumnDef<TFeatures, TData, TValue> = 
  | AccessorKeyColumnDef<TFeatures, TData, TValue>
| AccessorFnColumnDef<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L194)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
