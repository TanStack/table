---
id: row_getToggleSelectedHandler
title: row_getToggleSelectedHandler
---

# Function: row\_getToggleSelectedHandler()

```ts
function row_getToggleSelectedHandler<TFeatures, TData>(row): (e) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:563](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L563)

Returns an event handler for toggling selected handler.

The handler is intended for direct use in row-level controls such as expansion or selection buttons.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

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
const value = row_getToggleSelectedHandler(row)
```
