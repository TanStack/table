---
id: table_getStartHeaderGroups
title: table_getStartHeaderGroups
---

# Function: table\_getStartHeaderGroups()

```ts
function table_getStartHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:385](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L385)

Builds header groups for visible columns pinned to the start region.

The leaf columns are read in `state.columnPinning.start` order and then passed
through the same header-group builder as the unpinned table.

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
const headerGroups = table_getStartHeaderGroups(table)
```
