---
id: column_getPinnedIndex
title: column_getPinnedIndex
---

# Function: column\_getPinnedIndex()

```ts
function column_getPinnedIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L103)

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
