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

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.utils.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L114)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### originalRow

`TData`

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### index

`number`

### parent?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`string`
