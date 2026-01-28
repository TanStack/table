---
id: constructRow
title: constructRow
---

# Function: constructRow()

```ts
function constructRow<TFeatures, TData>(
   table, 
   id, 
   original, 
   rowIndex, 
   depth, 
   subRows?, 
parentId?): Row<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/rows/constructRow.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/constructRow.ts#L24)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### id

`string`

### original

`TData`

### rowIndex

`number`

### depth

`number`

### subRows?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

### parentId?

`string`

## Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>
