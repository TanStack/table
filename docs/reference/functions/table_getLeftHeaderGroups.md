---
id: table_getLeftHeaderGroups
title: table_getLeftHeaderGroups
---

# Function: table\_getLeftHeaderGroups()

```ts
function table_getLeftHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:213](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L213)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]
