---
id: column_getToggleGroupingHandler
title: column_getToggleGroupingHandler
---

# Function: column\_getToggleGroupingHandler()

```ts
function column_getToggleGroupingHandler<TFeatures, TData, TValue>(column): () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L124)

Creates a header/control handler that toggles grouping for this column.

The handler is a no-op when `column_getCanGroup(column)` is false.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

```ts
(): void;
```

### Returns

`void`

## Example

```ts
const onClick = column_getToggleGroupingHandler(column)
```
