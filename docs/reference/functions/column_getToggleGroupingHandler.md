---
id: column_getToggleGroupingHandler
title: column_getToggleGroupingHandler
---

# Function: column\_getToggleGroupingHandler()

```ts
function column_getToggleGroupingHandler<TFeatures, TData, TValue>(column): () => void;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L62)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

```ts
(): void;
```

### Returns

`void`
