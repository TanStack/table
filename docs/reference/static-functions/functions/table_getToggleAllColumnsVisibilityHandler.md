---
id: table_getToggleAllColumnsVisibilityHandler
title: table_getToggleAllColumnsVisibilityHandler
---

# Function: table\_getToggleAllColumnsVisibilityHandler()

```ts
function table_getToggleAllColumnsVisibilityHandler<TFeatures, TData>(table): (e) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:374](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L374)

Creates a checkbox-style handler that shows or hides all columns.

The handler reads `event.target.checked`, so it is intended for controls whose
checked state means "all columns visible".

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
const onChange = table_getToggleAllColumnsVisibilityHandler(table)
```
