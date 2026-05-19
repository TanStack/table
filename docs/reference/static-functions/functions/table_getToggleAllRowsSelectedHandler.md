---
id: table_getToggleAllRowsSelectedHandler
title: table_getToggleAllRowsSelectedHandler
---

# Function: table\_getToggleAllRowsSelectedHandler()

```ts
function table_getToggleAllRowsSelectedHandler<TFeatures, TData>(table): (e) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:370](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L370)

Creates a checkbox-style handler that selects or deselects all rows.

The handler reads `event.target.checked`, so it is intended for controls whose
checked state means "all rows selected".

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
const onChange = table_getToggleAllRowsSelectedHandler(table)
```
