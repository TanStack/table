---
id: column_getSortIndex
title: column_getSortIndex
---

# Function: column\_getSortIndex()

```ts
function column_getSortIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:280](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L280)

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
