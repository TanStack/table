---
id: AccessorFn
title: AccessorFn
---

# Type Alias: AccessorFn()\<TData, TValue\>

```ts
type AccessorFn<TData, TValue>: (originalRow, index) => TValue;
```

## Type Parameters

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Parameters

• **originalRow**: `TData`

• **index**: `number`

## Returns

`TValue`

## Defined in

[types/ColumnDef.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L20)
