---
id: table_getHeaderGroups
title: table_getHeaderGroups
---

# Function: table\_getHeaderGroups()

```ts
function table_getHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L78)

Builds visible header groups for the current column tree.

Column visibility and pinning are applied before groups are built. When no
columns are pinned, the fast path skips pin partitioning.

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
const headerGroups = table_getHeaderGroups(table)
```
