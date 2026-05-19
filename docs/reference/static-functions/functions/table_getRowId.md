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

Defined in: [core/rows/coreRowsFeature.utils.ts:215](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L215)

Resolves the stable id for a row.

`options.getRowId` wins when provided. Otherwise root rows use their index
and child rows append their index to the parent id, such as `0.2`.

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
const id = table_getRowId(originalRow, table, index, parentRow)
```
