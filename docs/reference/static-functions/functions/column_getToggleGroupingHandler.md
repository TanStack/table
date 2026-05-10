---
id: column_getToggleGroupingHandler
title: column_getToggleGroupingHandler
---

# Function: column\_getToggleGroupingHandler()

```ts
function column_getToggleGroupingHandler<TFeatures, TData, TValue>(column): () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L122)

Returns an event handler for toggling grouping handler.

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
(): void;
```

### Returns

`void`

## Example

```ts
const value = column_getToggleGroupingHandler(column)
```
