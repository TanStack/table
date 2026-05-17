---
id: table_getToggleAllRowsExpandedHandler
title: table_getToggleAllRowsExpandedHandler
---

# Function: table\_getToggleAllRowsExpandedHandler()

```ts
function table_getToggleAllRowsExpandedHandler<TFeatures, TData>(table): (e) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L145)

Creates an event handler that toggles all rows expanded.

React-style synthetic events are persisted when present before the table state
is toggled.

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
const onClick = table_getToggleAllRowsExpandedHandler(table)
```
