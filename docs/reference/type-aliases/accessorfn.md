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

[types/ColumnDef.ts:25](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/ColumnDef.ts#L25)
