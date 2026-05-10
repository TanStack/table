---
id: AccessorFn
title: AccessorFn
---

# Type Alias: AccessorFn()\<TData, TValue\>

```ts
type AccessorFn<TData, TValue> = (originalRow, index) => TValue;
```

Defined in: [types/ColumnDef.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L30)

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
