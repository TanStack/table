---
id: table_getEndHeaderGroups
title: table_getEndHeaderGroups
---

# Function: table\_getEndHeaderGroups()

```ts
function table_getEndHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:419](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L419)

Builds header groups for visible columns pinned to the end region.

The leaf columns are read in `state.columnPinning.end` order and then
passed through the same header-group builder as the unpinned table.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../../index/interfaces/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

## Example

```ts
const headerGroups = table_getEndHeaderGroups(table)
```
