---
id: table_getToggleAllRowsExpandedHandler
title: table_getToggleAllRowsExpandedHandler
---

# Function: table\_getToggleAllRowsExpandedHandler()

```ts
function table_getToggleAllRowsExpandedHandler<TFeatures, TData>(table): (_e) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L170)

Creates an event handler that toggles all rows expanded.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

```ts
(_e): void;
```

### Parameters

#### \_e

`unknown`

### Returns

`void`

## Example

```ts
const onClick = table_getToggleAllRowsExpandedHandler(table)
```
