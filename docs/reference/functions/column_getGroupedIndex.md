---
id: column_getGroupedIndex
title: column_getGroupedIndex
---

# Function: column\_getGroupedIndex()

```ts
function column_getGroupedIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L54)

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

`number`
