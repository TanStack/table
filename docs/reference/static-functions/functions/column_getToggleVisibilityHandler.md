---
id: column_getToggleVisibilityHandler
title: column_getToggleVisibilityHandler
---

# Function: column\_getToggleVisibilityHandler()

```ts
function column_getToggleVisibilityHandler<TFeatures, TData, TValue>(column): (e) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L111)

Creates a checkbox-style handler that writes this column's visibility.

The handler reads `event.target.checked`, so it is intended for visibility
controls whose checked state means "visible".

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
const onChange = column_getToggleVisibilityHandler(column)
```
