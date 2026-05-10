---
id: row_getToggleExpandedHandler
title: row_getToggleExpandedHandler
---

# Function: row\_getToggleExpandedHandler()

```ts
function row_getToggleExpandedHandler<TFeatures, TData>(row): () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:349](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L349)

Returns an event handler for toggling expanded handler.

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
(): void;
```

### Returns

`void`

## Example

```ts
const value = row_getToggleExpandedHandler(row)
```
