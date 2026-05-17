---
id: table_getRightFooterGroups
title: table_getRightFooterGroups
---

# Function: table\_getRightFooterGroups()

```ts
function table_getRightFooterGroups<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:494](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L494)

Builds footer groups for the right pinned region.

Footer groups reuse the right header groups in reverse order.

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
const footerGroups = table_getRightFooterGroups(table)
```
