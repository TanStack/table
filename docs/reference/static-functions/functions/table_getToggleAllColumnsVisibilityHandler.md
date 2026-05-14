---
id: table_getToggleAllColumnsVisibilityHandler
title: table_getToggleAllColumnsVisibilityHandler
---

# Function: table\_getToggleAllColumnsVisibilityHandler()

```ts
function table_getToggleAllColumnsVisibilityHandler<TFeatures, TData>(table): (e) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:329](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L329)

Returns an event handler for all columns visibility handler.

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
const value = table_getToggleAllColumnsVisibilityHandler(table)
```
