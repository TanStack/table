---
id: table_getCenterFooterGroups
title: table_getCenterFooterGroups
---

# Function: table\_getCenterFooterGroups()

```ts
function table_getCenterFooterGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:532](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L532)

Builds footer groups for the center, unpinned region.

Footer groups reuse the center header groups in reverse order.

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
const footerGroups = table_getCenterFooterGroups(table)
```
