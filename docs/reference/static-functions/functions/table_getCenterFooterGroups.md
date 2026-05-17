---
id: table_getCenterFooterGroups
title: table_getCenterFooterGroups
---

# Function: table\_getCenterFooterGroups()

```ts
function table_getCenterFooterGroups<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:516](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L516)

Builds footer groups for the center, unpinned region.

Footer groups reuse the center header groups in reverse order.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`any`[]

## Example

```ts
const footerGroups = table_getCenterFooterGroups(table)
```
