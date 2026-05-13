---
id: table_getRowId
title: table_getRowId
---

# Function: table\_getRowId()

```ts
function table_getRowId<TFeatures, TData>(
   originalRow, 
   table, 
   index, 
   parent?): string;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L203)

Returns row id for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### originalRow

`TData`

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### index

`number`

### parent?

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`string`

## Example

```ts
const value = table_getRowId(table)
```
