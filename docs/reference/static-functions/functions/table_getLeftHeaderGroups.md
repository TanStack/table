---
id: table_getLeftHeaderGroups
title: table_getLeftHeaderGroups
---

# Function: table\_getLeftHeaderGroups()

```ts
function table_getLeftHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:362](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L362)

Builds header groups for visible columns pinned to the left region.

The leaf columns are read in `state.columnPinning.left` order and then passed
through the same header-group builder as the unpinned table.

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
const headerGroups = table_getLeftHeaderGroups(table)
```
