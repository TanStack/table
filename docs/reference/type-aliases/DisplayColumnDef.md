---
id: DisplayColumnDef
title: DisplayColumnDef
---

# Type Alias: DisplayColumnDef\<TFeatures, TData, TValue\>

```ts
type DisplayColumnDef<TFeatures, TData, TValue> = ColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L142)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
