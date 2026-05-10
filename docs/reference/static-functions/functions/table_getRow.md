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

Defined in: [core/rows/coreRowsFeature.utils.ts:230](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L230)

Returns row for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

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
const value = table_getRow(table)
```
