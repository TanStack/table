---
id: table_getRow
title: table_getRow
---

# Function: table\_getRow()

```ts
function table_getRow<TFeatures, TData>(
   table, 
   rowId, 
searchAll?): Row<TFeatures, TData>;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:241](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L241)

Looks up a row by id from the current or full row model.

By default this searches `table.getRowModel()`. Passing `searchAll` searches
the pre-pagination model first, then falls back to the core model.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### rowId

`string`

### searchAll?

`boolean`

## Returns

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Example

```ts
const row = table_getRow(table, rowId, true)
```
