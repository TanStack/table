---
id: table_getToggleAllRowsSelectedHandler
title: table_getToggleAllRowsSelectedHandler
---

# Function: table\_getToggleAllRowsSelectedHandler()

```ts
function table_getToggleAllRowsSelectedHandler<TFeatures, TData>(table): (e) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:357](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L357)

Returns an event handler for all rows selected handler.

The handler calls the matching table toggle API and can be attached directly to checkbox or button UI.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`

## Example

```ts
const value = table_getToggleAllRowsSelectedHandler(table)
```
