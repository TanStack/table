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

Defined in: [core/rows/coreRowsFeature.utils.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L129)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### rowId

`string`

### searchAll?

`boolean`

## Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>
