---
id: table_getLeftHeaderGroups
title: table_getLeftHeaderGroups
---

# Function: table\_getLeftHeaderGroups()

```ts
function table_getLeftHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:342](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L342)

Returns left header groups for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../../index/type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

## Example

```ts
const value = table_getLeftHeaderGroups(table)
```
