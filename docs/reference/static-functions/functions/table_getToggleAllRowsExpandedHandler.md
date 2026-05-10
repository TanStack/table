---
id: table_getToggleAllRowsExpandedHandler
title: table_getToggleAllRowsExpandedHandler
---

# Function: table\_getToggleAllRowsExpandedHandler()

```ts
function table_getToggleAllRowsExpandedHandler<TFeatures, TData>(table): (e) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L136)

Returns an event handler for all rows expanded handler.

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
const value = table_getToggleAllRowsExpandedHandler(table)
```
