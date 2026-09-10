---
id: table_getStartFooterGroups
title: table_getStartFooterGroups
---

# Function: table\_getStartFooterGroups()

```ts
function table_getStartFooterGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:483](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L483)

Builds footer groups for the start pinned region.

Footer groups reuse the start header groups in reverse order.

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
const footerGroups = table_getStartFooterGroups(table)
```
