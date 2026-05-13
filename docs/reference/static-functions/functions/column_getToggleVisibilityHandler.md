---
id: column_getToggleVisibilityHandler
title: column_getToggleVisibilityHandler
---

# Function: column\_getToggleVisibilityHandler()

```ts
function column_getToggleVisibilityHandler<TFeatures, TData, TValue>(column): (e) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L106)

Returns an event handler for toggling visibility handler.

The handler is intended for direct use in column header controls such as buttons or checkboxes.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

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
const value = column_getToggleVisibilityHandler(column)
```
