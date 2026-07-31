---
id: assignTableAPIs
title: assignTableAPIs
---

# Function: assignTableAPIs()

```ts
function assignTableAPIs<TFeatures, TData>(
   feature, 
   table, 
   apis): void;
```

Defined in: [utils.ts:359](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L359)

Assigns Table API methods directly to the table instance.
Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### feature

keyof `TFeatures` & `string`

### table

[`Table_Internal`](../interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### apis

[`APIObject`](../type-aliases/APIObject.md)

## Returns

`void`
