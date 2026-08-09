---
id: table_getCenterHeaderGroups
title: table_getCenterHeaderGroups
---

# Function: table\_getCenterHeaderGroups()

```ts
function table_getCenterHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:453](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L453)

Builds header groups for visible columns that are not pinned.

Start- and end-pinned column ids are removed from the visible leaf column
list before header groups are built for the center region.

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
const headerGroups = table_getCenterHeaderGroups(table)
```
