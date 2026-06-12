---
id: AccessorFn
title: AccessorFn
---

# Type Alias: AccessorFn()\<TData, TValue\>

```ts
type AccessorFn<TData, TValue> = (originalRow, index) => TValue;
```

Defined in: [types/ColumnDef.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L49)

Reads a cell value from an original row object.

The row index is provided for accessors that need stable position-aware
derived values.

## Type Parameters

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)

## Parameters

### originalRow

`TData`

### index

`number`

## Returns

`TValue`
