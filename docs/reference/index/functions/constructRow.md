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

Defined in: [core/rows/constructRow.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/constructRow.ts#L30)

Constructs a row instance from normalized table internals.

This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.

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
